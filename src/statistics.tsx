import * as stats from "simple-statistics";
import {
  FieldType,
  INumberField,
  IRecord,
  ISelectFieldOption,
  ISingleSelectField,
  ITable,
  bitable,
  checkers,
} from "@lark-base-open/js-sdk";
import _ from "lodash";

export const Z_SCORE = "z-score";
export const IQR = "IQR";

export interface Dict {
  normal: string;
  suspicious: string;
  abnormal: string;
  fieldSuffix: string;
}

async function createResultField(
  table: ITable,
  dict: Dict,
  resultFieldName: string
) {
  const fiedlId = await table.addField({
    type: FieldType.SingleSelect,
    name: resultFieldName,
  });
  const field = await table.getFieldById<ISingleSelectField>(fiedlId);
  await field.addOptions([
    {
      name: dict.normal,
      color: 21,
    },
    {
      name: dict.suspicious,
      color: 19,
    },
    {
      name: dict.abnormal,
      color: 17,
    },
  ]);
  return field;
}

interface NumberRecord {
  id: string;
  value: number;
}

export async function detectField(
  tableId: string,
  viewId: string,
  fieldId: string,
  method: string,
  dict: Dict
) {
  // get table and view
  const table = await bitable.base.getTableById(tableId);
  const view = await table.getViewById(viewId);

  // get number fields and values
  const records = await getAllRecords(table, view.id, []);
  const numberRecords = new Array<NumberRecord>();
  const values = new Array<number>();
  for (const record of records) {
    if (record.recordId === undefined) {
      continue;
    }
    const value = record.fields[fieldId];
    if (checkers.isNumber(value)) {
      numberRecords.push({
        id: record.recordId,
        value: value,
      });
      values.push(value);
    }
  }

  // get or create result field
  const field = await table.getFieldById<INumberField>(fieldId);
  const fieldName = await field.getName();
  const resultFieldName = fieldName + dict.fieldSuffix;
  let resultField;
  if (await isFieldExist(table, resultFieldName)) {
    resultField = await table.getFieldByName<ISingleSelectField>(
      resultFieldName
    );
  } else {
    resultField = await createResultField(table, dict, resultFieldName);
  }

  // detect records
  const options = await resultField.getOptions();
  const updateRecords = detectRecords(
    resultField.id,
    options,
    method,
    dict,
    numberRecords,
    values
  );

  // update records in chunks
  const updateRecordsChunks = _.chunk(updateRecords, 5000);
  for (const updateRecordsChunk of updateRecordsChunks) {
    await table.setRecords(updateRecordsChunk);
  }
}

async function getAllRecords(
  table: ITable,
  viewId: string,
  records: IRecord[],
  pageToken?: number
) {
  const recordsRes = await table.getRecordsByPage({
    viewId: viewId,
    pageSize: 200,
    pageToken: pageToken,
  });
  records.push(...recordsRes.records);
  if (recordsRes.hasMore) {
    const moreRecords = await getAllRecords(table, viewId, records, pageToken);
    records.push(...moreRecords);
  }
  return records;
}

async function isFieldExist(table: ITable, fieldName: string) {
  const fileds = await table.getFieldMetaList();
  for (const field of fileds) {
    if (field.name === fieldName) {
      return true;
    }
  }
  return false;
}

function detectRecords(
  resultFieldId: string,
  options: ISelectFieldOption[],
  method: string,
  dict: Dict,
  numberRecords: NumberRecord[],
  values: number[]
) {
  // calculate indicators
  const mean = stats.mean(values);
  const std = stats.standardDeviation(values);
  const q1 = stats.quantile(values, 0.25);
  const q3 = stats.quantile(values, 0.75);
  const iqr = q3 - q1;
  const lowerBound1 = q1 - 1.5 * iqr;
  const upperBound1 = q3 + 1.5 * iqr;
  const lowerBound2 = q1 - 3 * iqr;
  const upperBound2 = q3 + 3 * iqr;

  const updateRecords = new Array<IRecord>();
  for (const record of numberRecords) {
    let result: string;
    switch (method) {
      case Z_SCORE:
        result = zScoreDetect(dict, mean, std, record.value);
        break;
      case IQR:
        result = IQRDetect(
          dict,
          lowerBound1,
          upperBound1,
          lowerBound2,
          upperBound2,
          record.value
        );
        break;
      default:
        throw new Error("unknown method");
    }

    const resultIdMap = new Map<string, string>();
    for (const option of options) {
      resultIdMap.set(option.name, option.id);
    }

    updateRecords.push({
      recordId: record.id,
      fields: {
        [resultFieldId]: {
          id: resultIdMap.get(result) as string,
          text: result,
        },
      },
    });
  }

  return updateRecords;
}

function zScoreDetect(dict: Dict, mean: number, std: number, x: number) {
  const zScore = stats.zScore(x, mean, std);
  if (zScore > 3 || zScore < -3) {
    return dict.abnormal;
  } else if (zScore > 2 || zScore < -2) {
    return dict.suspicious;
  } else {
    return dict.normal;
  }
}

function IQRDetect(
  dict: Dict,
  lowerBound1: number,
  upperBound1: number,
  lowerBound2: number,
  upperBound2: number,
  x: number
) {
  if (x > upperBound2 || x < lowerBound2) {
    return dict.abnormal;
  } else if (x > upperBound1 || x < lowerBound1) {
    return dict.suspicious;
  } else {
    return dict.normal;
  }
}
