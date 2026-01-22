---
id: 49
Section: Data Science
slug: articles/exploratory-data-analysis-eda-using-python.html
name: Exploratory Data Analysis with Python
description: Explore essential techniques of Exploratory Data Analysis (EDA) using Python, focusing on data sanity checks and visualization methods.
keywords: Exploratory Data Analysis, Python, data visualization, data science, Mark Hazleton, EDA techniques
img_src: /img/ScotlandHighlands.jpg
lastmod: 2024-06-23
publishedDate: 2024-10-06
estimatedReadTime: 5
changefreq: monthly
subtitle: Master the art of data exploration and visualization with Python's powerful libraries.
author: Mark Hazleton
summary: Exploratory Data Analysis (EDA) is a crucial step in the data science process, allowing analysts to uncover patterns, spot anomalies, and test hypotheses. This guide delves into the techniques and tools used in EDA, with a focus on Python's capabilities.
conclusionTitle: Key Takeaways from EDA with Python
conclusionSummary: EDA is a foundational step in data analysis, offering insights and guiding further analysis. Python's libraries provide powerful tools for effective data exploration.
conclusionKeyHeading: Bottom Line
conclusionKeyText: Mastering EDA with Python empowers data scientists to make data-driven decisions confidently.
conclusionText: As you continue your journey in data science, remember that EDA is not just a preliminary step but a continuous process of discovery. Utilize Python's tools to enhance your analytical capabilities and drive impactful insights.
seo:
  title: Exploratory Data Analysis with Python 
  titleSuffix:  
  description: Discover essential techniques for Exploratory Data Analysis using Python. Learn data sanity checks and visualization methods to enhance your data insights.
  keywords: Exploratory Data Analysis, Python, EDA, data visualization, data science, Mark Hazleton
  canonical: https://markhazleton.com/articles/exploratory-data-analysis-eda-using-python.html
  robots: index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1
og:
  title: Exploratory Data Analysis with Python
  description: Discover essential techniques for Exploratory Data Analysis using Python. Learn data sanity checks and visualization methods to enhance your data insights.
  type: article
  image: null
  imageAlt: Exploratory Data Analysis (EDA) Using Python - Mark Hazleton
twitter:
  title: EDA with Python
  description: Discover essential techniques for Exploratory Data Analysis using Python. Learn data sanity checks and visualization methods to enhance your data insights.
  image: null
  imageAlt: Exploratory Data Analysis (EDA) Using Python - Mark Hazleton
youtubeUrl: https://www.youtube.com/watch?v=3KO0GuTkPew
youtubeTitle: "Deep Dive:  EDA with Python"
---

# Exploratory Data Analysis (EDA) Using Python

## A Comprehensive Guide to Data Sanity Checks and EDA

Before venturing into advanced data analysis or machine learning, it's essential to ensure that the data you're working with is clean and coherent. This article outlines the process of conducting Data Sanity checks and Exploratory Data Analysis (EDA), both of which are critical first steps in understanding your dataset.

While the initial stages don't involve modifying the data, these actions help uncover potential issues such as missing values, duplicates, and outliers, while providing valuable insights into the data's structure and relationships.

It's important to start by inspecting the dataset to familiarize yourself with its contents and structure. Understanding the data is key to identifying any problems that might affect your analysis. Once this preliminary examination is complete, you can decide whether data cleaning or preprocessing is needed.

### Key Focus Areas

- Data sanity checks
- Exploratory data analysis
- Missing value detection
- Outlier identification

## Table of Contents

1. [Understanding the Dataset](#understanding-the-dataset)
2. [Data Sanity Checks](#data-sanity-checks)
3. [Exploratory Data Analysis (EDA)](#exploratory-data-analysis-eda)
4. [Automating Univariate and Bivariate Analysis](#automating-univariate-and-bivariate-analysis)
5. [Plan for Data Cleaning and Preprocessing](#plan-for-data-cleaning-and-preprocessing)
6. [Conclusion](#conclusion)
7. [EDA FAQ](#eda-faq)
8. [Summary Checklist](#summary-checklist)
9. [Glossary](#glossary)

## Understanding the Dataset

Recently, I worked with a nutritional dataset from Kaggle using Google Colab, which allows for writing and executing Python code in a browser-based Jupyter notebook. The objective was to analyze nutrient patterns across a range of foods and categorize them based on their nutrient content.

Kaggle is a fantastic resource for data scientists and enthusiasts, offering a wealth of datasets across different fields. Whether you're looking to explore healthcare, finance, or more specialized areas like nutrition, Kaggle provides an excellent platform to practice data analysis and machine learning techniques.

**Dataset Details:** The dataset I explored included nutritional values for various foods and products, detailing their protein, fat, vitamin C, and fiber content. You can find the full code and analysis in my [Google Drive folder](https://drive.google.com/drive/folders/1cF49bLIgTwHMNwo7TxSjMw_8m-yw2cBg?usp=sharing).

## Data Sanity Checks

Before diving into EDA, it's crucial to perform data sanity checks to ensure the dataset's integrity:

- **Check for Missing Values:** Identify and handle missing data appropriately.
- **Check for Duplicates:** Remove duplicate entries to avoid skewed results.
- **Data Types Verification:** Ensure data types are correct for each column.
- **Range Validation:** Verify that numerical values fall within expected ranges.
- **Consistency Checks:** Ensure data is consistent across related fields.

## Exploratory Data Analysis (EDA)

Exploratory Data Analysis (EDA) is a method used by data scientists to analyze datasets and summarize their main characteristics, often using visual methods. It is a critical step in understanding the data before proceeding with more complex analyses or modeling.

### Why EDA?

- **Identify Patterns:** EDA helps in identifying patterns and relationships in data.
- **Spot Anomalies:** It allows for the detection of outliers and anomalies that might skew the analysis.
- **Hypothesis Testing:** EDA provides a foundation for hypothesis testing and further statistical analysis.

### Tools and Libraries

Python offers several libraries that are essential for conducting EDA:

- **Pandas:** For data manipulation and analysis.
- **Matplotlib:** For creating static, interactive, and animated visualizations.
- **Seaborn:** Built on top of Matplotlib, it provides a high-level interface for drawing attractive statistical graphics.
- **NumPy:** For numerical data processing.

### Visualization Techniques

- **Histograms:** To understand the distribution of a single variable.
- **Scatter Plots:** To identify relationships between two variables.
- **Box Plots:** To visualize the spread and identify outliers.
- **Heatmaps:** To display the correlation between variables.

## Automating Univariate and Bivariate Analysis

During your Data Sanity checks, it's essential to classify your variables into numerical, categorical, and dependent types before starting your Exploratory Data Analysis (EDA).

In the early stages of data analysis, you will often need to determine whether your variables are numerical, categorical, or dependent. Identifying these is crucial for:

- Performing the correct statistical methods on your data
- Automating your exploratory analysis using scripts
- Generating meaningful insights into relationships between features

Once these variables are classified, you can begin the process of performing univariate (analyzing one variable) and bivariate (analyzing relationships between two variables) analysis. Automating this process will save you time and ensure consistency in your Exploratory Data Analysis (EDA).

### Numerical Univariate Analysis

This function calculates the key statistical attributes for a numerical feature, including mean, median, variance, and skewness. It also provides visual insights using KDE plots, BoxPlots, and Histograms.

```python
def univariate_analysis(df, features):
    for feature in features:
        skewness = df[feature].skew()
        minimum = df[feature].min()
        maximum = df[feature].max()
        mean = df[feature].mean()
        mode = df[feature].mode().values[0]
        unique_count = df[feature].nunique()
        variance = df[feature].var()
        std_dev = df[feature].std()
        percentile_25 = df[feature].quantile(0.25)
        median = df[feature].median()
        percentile_75 = df[feature].quantile(0.75)
        data_range = maximum - minimum

        print(f"Univariate Analysis for {feature}")
        print(f"Skewness: {skewness:.4f}")
        print(f"Min: {minimum}")
        print(f"Max: {maximum}")
        print(f"Mean: {mean:.4f}")
        print(f"Mode: {mode}")
        print(f"Unique Count: {unique_count}")
        print(f"Variance: {variance:.4f}")
        print(f"Std Dev: {std_dev:.4f}")
        print(f"25th Percentile: {percentile_25}")
        print(f"Median (50th Pct): {median}")
        print(f"75th Percentile: {percentile_75}")
        print(f"Range: {data_range}")

        plt.figure(figsize=(18, 6))
        plt.subplot(1, 3, 1)
        sns.kdeplot(df[feature], fill=True)
        plt.title(f"KDE of {feature}")
        plt.subplot(1, 3, 2)
        sns.boxplot(df[feature])
        plt.title(f"Box Plot of {feature}")
        plt.subplot(1, 3, 3)
        sns.histplot(df[feature], bins=10, kde=True)
        plt.title(f"Histogram of {feature}")
        plt.tight_layout()
        plt.show()
```

This function provides a comprehensive analysis for each numerical feature by calculating statistical attributes and generating KDE, BoxPlot, and Histogram visualizations.

### Categorical Univariate Analysis

For categorical features, we analyze the distribution of categories and their relationship with the dependent feature. Here's a function that automates this process:

```python
def univariate_analysis_categorical(df, categorical_features):
    for feature in categorical_features:
        unique_categories = df[feature].nunique()
        mode = df[feature].mode().values[0]
        mode_freq = df[feature].value_counts().max()
        category_counts = df[feature].value_counts()
        category_percent = df[feature].value_counts(normalize=True) * 100
        missing_values = df[feature].isnull().sum()
        total_values = len(df[feature])
        imbalance_ratio = category_counts.max() / total_values

        print(f"Univariate Analysis for {feature}")
        print(f"Unique Categories: {unique_categories}")
        print(f"Mode (Most frequent): {mode}")
        print(f"Frequency of Mode: {mode_freq}")
        print(f"Missing Values: {missing_values}")
        print(f"Imbalance Ratio (Max/Total): {imbalance_ratio:.4f}")
        print(f"Category Counts:\n{category_counts}")

        plt.figure(figsize=(10, 6))
        sns.countplot(x=df[feature], order=df[feature].value_counts().index)
        plt.title(f"Frequency of {feature} Categories")
        plt.xlabel(feature)
        plt.ylabel("Count")
        plt.tight_layout()
        plt.show()
```

This function provides a clear understanding of how categories are distributed across the data and helps identify potential imbalances.

### Automating Bivariate Analysis

Bivariate analysis allows you to understand the relationship between two variables. The following function calculates key attributes for a numerical feature in relation to a boolean dependent feature. It prints out key insights and generates side-by-side visualizations to understand their relationship.

```python
def bivariate_analysis(df, numerical_features, categorical_features, dependent_feature):
    if numerical_features:
        for feature in numerical_features:
            mean_0 = df[df[dependent_feature] == 0][feature].mean()
            mean_1 = df[df[dependent_feature] == 1][feature].mean()
            median_0 = df[df[dependent_feature] == 0][feature].median()
            median_1 = df[df[dependent_feature] == 1][feature].median()
            var_0 = df[df[dependent_feature] == 0][feature].var()
            var_1 = df[df[dependent_feature] == 1][feature].var()

            print(f"Mean {feature} for group 0: {mean_0:.2f}")
            print(f"Mean {feature} for group 1: {mean_1:.2f}")
            print(f"Median {feature} for group 0: {median_0:.2f}")
            print(f"Median {feature} for group 1: {median_1:.2f}")
            print(f"Variance of {feature} for group 0: {var_0:.2f}")
            print(f"Variance of {feature} for group 1: {var_1:.2f}")

            fig, axes = plt.subplots(1, 2, figsize=(16, 6))
            sns.boxplot(x=df[dependent_feature], y=df[feature], ax=axes[0])
            axes[0].set_title(f"{feature} Distribution by {dependent_feature}")
            sns.barplot(x=df[dependent_feature], y=df[feature], estimator='mean', ax=axes[1])
            axes[1].set_title(f"Mean {feature} by {dependent_feature}")
            plt.tight_layout()
            plt.show()

    if categorical_features:
        for feature in categorical_features:
            category_distribution = df.groupby([feature, dependent_feature]).size().unstack(fill_value=0)
            chi2, p, dof, expected = chi2_contingency(category_distribution)

            print(f"Chi-Square Test for {feature}: Chi2 = {chi2:.4f}, p-value = {p:.4f}")
            fig, axes = plt.subplots(1, 2, figsize=(16, 6))
            sns.countplot(x=df[feature], hue=df[dependent_feature], ax=axes[0])
            axes[0].set_title(f"{feature} Count by {dependent_feature}")
            sns.barplot(x=df[feature], y=df[dependent_feature], estimator='mean', ax=axes[1])
            axes[1].set_title(f"Proportion of {dependent_feature} by {feature}")
            plt.tight_layout()
            plt.show()
```

This function performs bivariate analysis by calculating key attributes and generating box plots, bar plots, and count plots to help you better understand the relationship between variables.

## Plan for Data Cleaning and Preprocessing

By conducting thorough data sanity checks and EDA, we lay a strong foundation for further analysis. With a clear understanding of the data, the next steps could include feature engineering, advanced visualizations, or machine learning.

## Conclusion

Exploratory Data Analysis is an indispensable part of the data analysis process. By leveraging Python's robust libraries, analysts can gain deep insights into their data, paving the way for more informed decision-making.

As you continue your journey in data science, remember that EDA is not just a preliminary step but a continuous process of discovery. Utilize Python's tools to enhance your analytical capabilities and drive impactful insights.

### Key Takeaways from EDA with Python

- EDA is a foundational step in data analysis, offering insights and guiding further analysis.
- Python's libraries provide powerful tools for effective data exploration.
- Mastering EDA with Python empowers data scientists to make data-driven decisions confidently.

## EDA FAQ

### What is Exploratory Data Analysis (EDA)?

EDA is the process of analyzing datasets to summarize their main characteristics, often using visual methods.

### Why is EDA important?

EDA helps you understand your data, detect anomalies, test assumptions, and prepare for modeling.

### What are common EDA techniques?

Common techniques include summary statistics, visualizations (histograms, boxplots, scatter plots), and correlation analysis.

### How do I handle missing data in EDA?

Identify missing values, then decide whether to remove, impute, or flag them based on context.

### What Python libraries are best for EDA?

pandas, matplotlib, seaborn, and missingno are popular libraries for EDA in Python.

## Summary Checklist

- ✅ Data sanity checks and EDA steps explained
- ✅ Complete Python code samples for automated analysis
- ✅ Univariate and bivariate analysis functions provided
- ✅ Visual techniques and statistical methods covered
- ✅ Table of Contents, FAQ, and Glossary included
- ✅ Real-world dataset example with Google Colab workflow

## Glossary

### EDA (Exploratory Data Analysis)

Exploratory Data Analysis (EDA) is the process of analyzing datasets to summarize their main characteristics, often using visual methods.

For more, see the [Wikipedia article on EDA](https://en.wikipedia.org/wiki/Exploratory_data_analysis).

### Outlier

An outlier is a data point that differs significantly from other observations in a dataset.

Learn more at [Wikipedia: Outlier](https://en.wikipedia.org/wiki/Outlier).

### IQR (Interquartile Range)

The interquartile range (IQR) is a measure of statistical dispersion, being equal to the difference between the upper and lower quartiles.

See [Wikipedia: Interquartile range](https://en.wikipedia.org/wiki/Interquartile_range) for details.

### Skewness

Skewness is a measure of the asymmetry of the probability distribution of a real-valued random variable about its mean.

More info: [Wikipedia: Skewness](https://en.wikipedia.org/wiki/Skewness).

### Pandas

Pandas is a powerful open-source Python library for data manipulation and analysis, providing flexible data structures like DataFrames.

See [Wikipedia: Pandas (software)](https://en.wikipedia.org/wiki/Pandas_(software)).

## Explore More Data Science Articles

Dive deeper into data science topics:

- [Python: The Language of Data Science](/articles/python-the-language-of-data-science.html)
- [An Introduction to Neural Networks](/articles/an-introduction-to-neural-networks.html)
