import { FieldType, UIBuilder } from "@lark-base-open/js-sdk";
import { UseTranslationResponse } from "react-i18next";
import { IQR, Z_SCORE } from "./statistics";
import { detectField } from "./statistics";
import { TFunction } from "i18next";

export default async function (
  uiBuilder: UIBuilder,
  { t }: UseTranslationResponse<"translation", undefined>
) {
  uiBuilder.form(
    (form) => ({
      formItems: [
        form.tableSelect("table", {
          label: t("selectTable"),
        }),
        form.viewSelect("view", {
          label: t("selectView"),
          sourceTable: "table",
        }),
        form.fieldSelect("field", {
          label: t("selectField"),
          sourceTable: "table",
          filterByTypes: [FieldType.Number],
        }),
        form.select("algorithm", {
          label: t("selectAlgorithm"),
          options: [
            { label: "IQR", value: IQR },
            { label: "Z-Score", value: Z_SCORE },
          ],
          defaultValue: "IQR",
        }),
      ],
      buttons: [t("button")],
    }),
    newDetecte(uiBuilder, t)
  );
  uiBuilder.markdown(t("description"));
}

interface FormParams {
  key: string;
  values: {
    [key: string]: unknown;
  };
}

interface optoin {
  id: string;
}

function newDetecte(
  uiBuilder: UIBuilder,
  t: TFunction<"translation", undefined>
) {
  return async function (params: FormParams) {
    const {
      table,
      view,
      field,
      algorithm,
    }: {
      table: optoin;
      view: optoin;
      field: optoin;
      algorithm: string;
    } = params.values as any;
    if (!table || !view || !field || !algorithm) {
      uiBuilder.message.error(t("mustSelectAllOptions"));
      return;
    }
    uiBuilder.showLoading(t("detecting"));
    await detectField(table.id, view.id, field.id, algorithm, {
      normal: t("normal"),
      suspicious: t("suspicious"),
      abnormal: t("abnormal"),
      fieldSuffix: t("fieldSuffix"),
    });
    uiBuilder.hideLoading();
  };
}
