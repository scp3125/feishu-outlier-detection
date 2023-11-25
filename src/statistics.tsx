import * as stats from "simple-statistics";
import {
  FieldType,
  INumberField,
  ISingleSelectField,
  ITable,
  bitable,
  checkers,
} from "@lark-base-open/js-sdk";

export const Z_SCORE = "z-score";
export const IQR = "IQR";

export interface dict {
  normal: string;
  suspicious: string;
  abnormal: string;
  fieldSuffix: string;
}

async function createResultField(
  table: ITable,
  dict: dict,
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
  // console.log(await field.getOptions());
  return field;
}

export async function detectField(
  tableId: string,
  viewId: string,
  fieldId: string,
  method: string,
  dict: dict
) {
  // get table and view
  const table = await bitable.base.getTableById(tableId);
  const view = await table.getViewById(viewId);

  // get values
  const dataField = await table.getFieldById<INumberField>(fieldId);
  const dataFieldName = await dataField.getName();
  const valueList = await dataField.getFieldValueList();
  const values = new Array<number>();
  for (const value of valueList) {
    if (checkers.isNumber(value.value)) {
      values.push(value.value);
    }
  }

  // if no value, return
  if (values.length === 0) {
    return;
  }

  // create result field
  const resultFieldName = dataFieldName + dict.fieldSuffix;
  let resultField;
  if (await isFieldExist(table, resultFieldName)) {
    resultField = await table.getFieldByName<ISingleSelectField>(
      resultFieldName
    );
  } else {
    resultField = await createResultField(table, dict, resultFieldName);
  }

  // calculate mean and std
  const mean = stats.mean(values);
  const std = stats.standardDeviation(values);
  const q1 = stats.quantile(values, 0.25);
  const q3 = stats.quantile(values, 0.75);
  const iqr = q3 - q1;
  const lowerBound1 = q1 - 1.5 * iqr;
  const upperBound1 = q3 + 1.5 * iqr;
  const lowerBound2 = q1 - 3 * iqr;
  const upperBound2 = q3 + 3 * iqr;

  // detect records
  const viewRecordIds = await view.getVisibleRecordIdList();
  const promises = new Array<Promise<any>>();
  for (const recordId of viewRecordIds) {
    if (recordId === undefined) {
      continue;
    }
    switch (method) {
      case Z_SCORE:
        promises.push(
          zScoreDetect(dataField, resultField, dict, recordId, mean, std)
        );
        break;
      case IQR:
        promises.push(
          IqrDetect(
            dataField,
            resultField,
            dict,
            recordId,
            lowerBound1,
            upperBound1,
            lowerBound2,
            upperBound2
          )
        );
        break;
      default:
        break;
    }
  }
  await Promise.all(promises);
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

async function zScoreDetect(
  dataField: INumberField,
  resultField: ISingleSelectField,
  dict: dict,
  recordId: string,
  mean: number,
  std: number
) {
  const value = await dataField.getValue(recordId);
  const zScore = stats.zScore(value, mean, std);
  if (zScore > 3 || zScore < -3) {
    await resultField.setValue(recordId, dict.abnormal);
  } else if (zScore > 2 || zScore < -2) {
    await resultField.setValue(recordId, dict.suspicious);
  } else {
    await resultField.setValue(recordId, dict.normal);
  }
}

async function IqrDetect(
  dataField: INumberField,
  resultField: ISingleSelectField,
  dict: dict,
  recordId: string,
  lowerBound1: number,
  upperBound1: number,
  lowerBound2: number,
  upperBound2: number
) {
  const value = await dataField.getValue(recordId);
  if (value > upperBound2 || value < lowerBound2) {
    await resultField.setValue(recordId, dict.abnormal);
  } else if (value > upperBound1 || value < lowerBound1) {
    await resultField.setValue(recordId, dict.suspicious);
  } else {
    await resultField.setValue(recordId, dict.normal);
  }
}
