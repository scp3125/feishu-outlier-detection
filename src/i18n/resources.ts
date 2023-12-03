const resources = {
  zh: {
    translation: {
      selectTable: "选择数据表",
      selectView: "选择视图",
      selectField: "选择字段",
      selectAlgorithm: "选择检测算法",
      zScore: "Z-Score(适用于正态分布)",
      IQR: "IQR（适用于非正态分布）",
      button: "检测",
      normal: "正常",
      suspicious: "可疑",
      abnormal: "异常",
      fieldSuffix: "-异常检测结果",
      mustSelectAllOptions: "必须选择所有选项",
      detecting: "检测中...",
      description: `
> #### IQR算法:
> ##### 算法简介
> IQR方法就像测量一条线的中间部分。如果数据点距离这条线太远，我们就认为它是“异常”。
> 
> 在本插件中，如果数据点离线太远（超过1.5倍或3倍的距离），我们会标记它为可疑或异常。
> 
> ##### 适用场景
> 当你的数据集看起来像是倾斜的，或者包含一些离群的点时，IQR方法很有用。它不需要我们假设数据是怎么分布的，所以在处理不是正常分布的数据时效果很好。
> 
> #### Z-Score 算法:
> 
> ##### 算法简介
> Z-Score方法是看数据点离平均值有多远，并用“标准差”（一种衡量数据分散程度的方法）来量化这个距离。
> 
> 在本插件中，如果数据点离平均值太远（超过2倍或3倍的标准差），我们会标记它为可疑或异常。
> 
> ##### 适用场景
> 当你的数据集看起来像是正常分布的（即大部分数据点都围绕在平均值附近）时，Z-Score方法很有用。但如果数据集明显偏离正常分布，这种方法可能就不太准确了。`,
    },
  },
  en: {
    translation: {
      selectTable: "Select Table",
      selectView: "Select View",
      selectField: "Select Field",
      selectAlgorithm: "Select Algorithm",
      zScore: "Z-Score (for normal distribution)",
      IQR: "IQR (for non-normal distribution)",
      button: "Detect",
      normal: "Normal",
      suspicious: "Suspicious",
      abnormal: "Abnormal",
      fieldSuffix: "-anomaly detection result",
      mustSelectAllOptions: "Must select all options",
      detecting: "Detecting...",
      description: `
> #### IQR Algorithm:
> ##### Algorithm Introduction
> The IQR method is like measuring the middle part of a line. If a data point is too far from this line, we consider it as an "outlier".
> 
> In this plugin, if a data point is too far from the line (exceeding 1.5 times or 3 times the distance), we mark it as a potential outlier or a definite outlier.
> 
> ##### Applicable Scenarios
> The IQR method is useful when your dataset appears skewed, or contains some outlier points. It doesn't require us to assume how the data is distributed, so it works well when dealing with data that is not normally distributed.
> 
> #### Z-Score Algorithm:
> 
> ##### Algorithm Introduction
> The Z-Score method looks at how far a data point is from the mean, and quantifies this distance using a "standard deviation" (a measure of how dispersed the data is).
> 
> In this plugin, if a data point is too far from the mean (exceeding 2 or 3 standard deviations), we mark it as a potential outlier or a definite outlier.
> 
> ##### Applicable Scenarios
> The Z-Score method is useful when your dataset appears to be normally distributed (i.e., most data points are centered around the mean). However, if the dataset deviates significantly from a normal distribution, this method may not be very accurate.`,
    },
  },
};

export default resources;
