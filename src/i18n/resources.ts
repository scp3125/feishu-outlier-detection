const resources = {
  zh: {
    translation: {
      selectTable: "选择数据表",
      selectView: "选择视图",
      selectField: "选择字段",
      selectAlgorithm: "选择检测算法",
      button: "检测",
      normal: "正常",
      suspicious: "可疑",
      abnormal: "异常",
      fieldSuffix: "-异常检测结果",
      mustSelectAllOptions: "必须选择所有选项",
      detecting: "检测中...",
      description: `
#### IQR算法:
##### 算法原理
IQR 是通过计算数据集的第一四分位数(Q1)和第三四分位数(Q3),然后计算它们之间的距离来进行异常值检测的。
      
在本插件中,超过 1.5 倍 IQR 的数据点将被认为是可疑，超过 3 倍 IQR 的数据点将被认为是异常。

##### 适用场景
IQR 算法对于偏斜分布和包含离群点的数据集相对更稳健。它不依赖于数据分布的假设，因此在处理非正态分布的数据时表现较好。

#### Z-Score 算法:

##### 算法原理
Z-Score是一种常用于异常值检测的统计方法。它通过将数据点与数据集的均值进行比较,然后用标准差衡量它们的偏离程度。

在本插件中,超过 2 倍标准差的数据点将被认为是可疑，超过 3 倍标准差的数据点将被认为是异常。

##### 适用场景
Z-Score 算法适用于数据分布近似正态的情况，但对于明显偏离正态分布的数据集可能效果较差。`,
    },
  },
  en: {
    translation: {
      selectTable: "Select Table",
      selectView: "Select View",
      selectField: "Select Field",
      selectAlgorithm: "Select Algorithm",
      button: "Detect",
      normal: "Normal",
      suspicious: "Suspicious",
      abnormal: "Abnormal",
      fieldSuffix: "-anomaly detection result",
      mustSelectAllOptions: "Must select all options",
      detecting: "Detecting...",
      description: `
#### IQR Algorithm:

##### Algorithm Principle
IQR is an algorithm for detecting outliers by calculating the first quartile (Q1) and the third quartile (Q3) of the dataset, and then calculating the distance between them.

In this plugin, data points that are more than 1.5 times the IQR are considered suspicious, and data points that are more than 3 times the IQR are considered abnormal.

##### Applicable Scenarios
The IQR algorithm is relatively robust for skewed distributions and datasets containing outliers. It does not depend on the assumption of data distribution, so it performs well when dealing with non-normal distribution data.

#### Z-Score Algorithm:

##### Algorithm Principle
Z-Score is a statistical method commonly used for outlier detection. It compares the data points with the mean of the dataset and then measures their deviation with the standard deviation.

In this plugin, data points that are more than 2 times the standard deviation are considered suspicious, and data points that are more than 3 times the standard deviation are considered abnormal.

##### Applicable Scenarios
The Z-Score algorithm is suitable for data sets with approximately normal distribution, but it may perform poorly for data sets that are obviously deviated from normal distribution.`,
    },
  },
};

export default resources;
