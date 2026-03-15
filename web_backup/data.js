// ============================================================
// Focus DS Tracker — All Curriculum Data
// 4 Months, 16 Weeks, 112 Days
// ============================================================

const CURRICULUM = {
  months: [
    {
      id: 1,
      title: "Month 1",
      subtitle: "Foundations",
      focus: "Python + SQL + Statistics + Excel",
      color: "#7c3aed",
      totalDays: 28,
      weeks: [
        {
          id: 1,
          title: "Week 1 — Python Basics",
          days: [
            { id: 1, title: "Day 1", task: "Setup — Install Python, VS Code, Jupyter" },
            { id: 2, title: "Day 2", task: "Variables & Data Types — int, float, str, bool, input()" },
            { id: 3, title: "Day 3", task: "Conditions — if / elif / else, operators" },
            { id: 4, title: "Day 4", task: "Loops — for, while, break, continue" },
            { id: 5, title: "Day 5", task: "Lists — indexing, slicing, append, sort" },
            { id: 6, title: "Day 6", task: "Dict, Set, Tuple — CRUD operations on all" },
            { id: 7, title: "Day 7", task: "Practice — 10 problems on HackerRank" },
            { id: 'p1', title: "🏗️ Project", task: "Calculator or Number Guessing Game", isProject: true }
          ]
        },
        {
          id: 2,
          title: "Week 2 — Python Intermediate",
          days: [
            { id: 8, title: "Day 8", task: "Functions — def, return, *args, **kwargs" },
            { id: 9, title: "Day 9", task: "Lambda & Functional — lambda, map, filter, zip" },
            { id: 10, title: "Day 10", task: "OOP Part 1 — Classes, Objects, init, self" },
            { id: 11, title: "Day 11", task: "OOP Part 2 — Inheritance, Polymorphism" },
            { id: 12, title: "Day 12", task: "File Handling — read, write, CSV, JSON" },
            { id: 13, title: "Day 13", task: "Exception Handling — try, except, finally" },
            { id: 14, title: "Day 14", task: "Practice — Mini OOP project" },
            { id: 'p2', title: "🏗️ Project", task: "Student Management System (OOP)", isProject: true }
          ]
        },
        {
          id: 3,
          title: "Week 3 — SQL Complete",
          days: [
            { id: 15, title: "Day 15", task: "SQL Basics — SELECT, WHERE, ORDER BY" },
            { id: 16, title: "Day 16", task: "DML — INSERT, UPDATE, DELETE" },
            { id: 17, title: "Day 17", task: "Joins — INNER, LEFT, RIGHT, FULL" },
            { id: 18, title: "Day 18", task: "Aggregations — GROUP BY, HAVING, COUNT, SUM" },
            { id: 19, title: "Day 19", task: "Advanced 1 — Subqueries, CTEs, CASE WHEN" },
            { id: 20, title: "Day 20", task: "Advanced 2 — Window Functions: RANK, LAG, LEAD" },
            { id: 21, title: "Day 21", task: "Practice — 15 SQL problems on HackerRank" },
            { id: 'p3', title: "🏗️ Project", task: "Sales Database Analysis", isProject: true }
          ]
        },
        {
          id: 4,
          title: "Week 4 — Statistics + Excel + Power BI Intro",
          days: [
            { id: 22, title: "Day 22", task: "Descriptive Stats — Mean, Median, Std Dev, IQR" },
            { id: 23, title: "Day 23", task: "Probability — Bayes Theorem, Distributions" },
            { id: 24, title: "Day 24", task: "Inferential Stats — Hypothesis, p-value, t-test" },
            { id: 25, title: "Day 25", task: "Advanced Stats — Chi-square, ANOVA, Correlation" },
            { id: 26, title: "Day 26", task: "Excel Basics — VLOOKUP, IF, Pivot Tables" },
            { id: 27, title: "Day 27", task: "Excel Advanced — INDEX-MATCH, Power Query, Dashboards" },
            { id: 28, title: "Day 28", task: "Power BI Intro — Connect data, visuals, DAX basics" }
          ]
        }
      ],
      outcomes: [
        "Python scripts comfortable",
        "Complex SQL queries written",
        "Statistics fundamentals understood",
        "4 projects on GitHub"
      ]
    },
    {
      id: 2,
      title: "Month 2",
      subtitle: "Data Analysis & Visualization",
      focus: "NumPy + Pandas + Visualization + Web Scraping + Power BI",
      color: "#0ea5e9",
      totalDays: 28,
      weeks: [
        {
          id: 5,
          title: "Week 5 — NumPy + Pandas",
          days: [
            { id: 29, title: "Day 29", task: "NumPy Basics — Arrays, shape, reshape, indexing" },
            { id: 30, title: "Day 30", task: "NumPy Ops — Broadcasting, arithmetic, comparison" },
            { id: 31, title: "Day 31", task: "NumPy Advanced — Linear algebra, random module" },
            { id: 32, title: "Day 32", task: "Pandas Basics — Series, DataFrame, read_csv" },
            { id: 33, title: "Day 33", task: "Pandas Cleaning — Null values, duplicates, dtypes" },
            { id: 34, title: "Day 34", task: "Pandas Advanced — GroupBy, merge, join, concat" },
            { id: 35, title: "Day 35", task: "Practice — Clean a Kaggle dataset" },
            { id: 'p5', title: "🏗️ Project", task: "EDA on Titanic / IPL Dataset", isProject: true }
          ]
        },
        {
          id: 6,
          title: "Week 6 — Matplotlib + Seaborn + Power BI",
          days: [
            { id: 36, title: "Day 36", task: "Matplotlib Basics" },
            { id: 37, title: "Day 37", task: "Matplotlib Advanced" },
            { id: 38, title: "Day 38", task: "Seaborn Basics" },
            { id: 39, title: "Day 39", task: "Seaborn Advanced — Heatmaps, Pairplot" },
            { id: 40, title: "Day 40", task: "Power BI Advanced — DAX, Relationships" },
            { id: 41, title: "Day 41", task: "Power BI Dashboard" },
            { id: 42, title: "Day 42", task: "Practice — 5 chart types from dataset" },
            { id: 'p6', title: "🏗️ Project", task: "Interactive Sales Dashboard in Power BI", isProject: true }
          ]
        },
        {
          id: 7,
          title: "Week 7 — Web Scraping",
          days: [
            { id: 43, title: "Day 43", task: "HTML Basics for scraping" },
            { id: 44, title: "Day 44", task: "Requests Library" },
            { id: 45, title: "Day 45", task: "BeautifulSoup" },
            { id: 46, title: "Day 46", task: "Scraping Practice" },
            { id: 47, title: "Day 47", task: "Selenium Basics" },
            { id: 48, title: "Day 48", task: "Selenium Advanced" },
            { id: 49, title: "Day 49", task: "Store to CSV & SQLite" },
            { id: 'p7', title: "🏗️ Project", task: "Job Listing or Price Tracker Scraper", isProject: true }
          ]
        },
        {
          id: 8,
          title: "Week 8 — Review + Data Analysis Capstone",
          days: [
            { id: '50-52', title: "Day 50–52", task: "Revise Python, SQL, Pandas" },
            { id: 53, title: "Day 53", task: "Choose dataset + problem statement" },
            { id: 54, title: "Day 54", task: "EDA + Visualizations" },
            { id: 55, title: "Day 55", task: "Write findings report" },
            { id: 56, title: "Day 56", task: "Push to GitHub + post on LinkedIn" }
          ]
        }
      ],
      outcomes: []
    },
    {
      id: 3,
      title: "Month 3",
      subtitle: "Machine Learning + Big Data + Deep Learning",
      focus: "Machine Learning + Big Data + Deep Learning",
      color: "#10b981",
      totalDays: 28,
      weeks: [
        {
          id: 9,
          title: "Week 9 — ML Fundamentals",
          days: [
            { id: 57, title: "Day 57", task: "ML Intro + Scikit-learn setup" },
            { id: 58, title: "Day 58", task: "Linear Regression" },
            { id: 59, title: "Day 59", task: "Logistic Regression" },
            { id: 60, title: "Day 60", task: "Decision Tree" },
            { id: 61, title: "Day 61", task: "Random Forest" },
            { id: 62, title: "Day 62", task: "SVM + KNN" },
            { id: 63, title: "Day 63", task: "Train models on 3 datasets" }
          ]
        },
        {
          id: 10,
          title: "Week 10 — Advanced ML",
          days: [
            { id: 64, title: "Day 64", task: "XGBoost, LightGBM" },
            { id: 65, title: "Day 65", task: "K-Means, DBSCAN Clustering" },
            { id: 66, title: "Day 66", task: "PCA, t-SNE" },
            { id: 67, title: "Day 67", task: "Model Evaluation — ROC, F1, CV" },
            { id: 68, title: "Day 68", task: "Feature Engineering" },
            { id: 69, title: "Day 69", task: "GridSearchCV / Hyperparameter Tuning" },
            { id: 70, title: "Day 70", task: "Scikit-learn Pipelines" },
            { id: 'p10', title: "🏗️ Project", task: "House Price Prediction or Customer Churn", isProject: true }
          ]
        },
        {
          id: 11,
          title: "Week 11 — Big Data (PySpark)",
          days: [
            { id: 71, title: "Day 71", task: "Hadoop, HDFS, MapReduce concepts" },
            { id: 72, title: "Day 72", task: "Spark Architecture, RDDs" },
            { id: 73, title: "Day 73", task: "PySpark + Docker Setup" },
            { id: 74, title: "Day 74", task: "PySpark DataFrames" },
            { id: 75, title: "Day 75", task: "Transformations + Actions + Joins" },
            { id: 76, title: "Day 76", task: "Spark SQL" },
            { id: 77, title: "Day 77", task: "PySpark MLlib" },
            { id: 'p11', title: "🏗️ Project", task: "Analyze 1M+ row dataset with PySpark", isProject: true }
          ]
        },
        {
          id: 12,
          title: "Week 12 — Deep Learning",
          days: [
            { id: 78, title: "Day 78", task: "Neural Networks basics" },
            { id: 79, title: "Day 79", task: "Backpropagation + Optimizers" },
            { id: 80, title: "Day 80", task: "Build ANN with Keras" },
            { id: 81, title: "Day 81", task: "CNN — Image Classification" },
            { id: 82, title: "Day 82", task: "RNN + LSTM" },
            { id: 83, title: "Day 83", task: "Dropout, BatchNorm, Early Stopping" },
            { id: 84, title: "Day 84", task: "MNIST / CIFAR-10 Classifier" }
          ]
        }
      ],
      outcomes: []
    },
    {
      id: 4,
      title: "Month 4",
      subtitle: "GenAI, LLMs & Deployment",
      focus: "NLP + LLMs + LangChain + RAG + LangGraph + Streamlit",
      color: "#f59e0b",
      totalDays: 28,
      weeks: [
        {
          id: 13,
          title: "Week 13 — NLP + LLM Fundamentals",
          days: [
            { id: 85, title: "Day 85", task: "Tokenization, Stemming, Lemmatization" },
            { id: 86, title: "Day 86", task: "Bag of Words, TF-IDF" },
            { id: 87, title: "Day 87", task: "Word2Vec, GloVe Embeddings" },
            { id: 88, title: "Day 88", task: "Transformers, BERT, GPT" },
            { id: 89, title: "Day 89", task: "HuggingFace Pipelines" },
            { id: 90, title: "Day 90", task: "OpenAI / Claude API + Prompt Engineering" },
            { id: 91, title: "Day 91", task: "Sentiment Analyzer + Text Classifier" }
          ]
        },
        {
          id: 14,
          title: "Week 14 — LangChain + RAG",
          days: [
            { id: 92, title: "Day 92", task: "LangChain — Chains, PromptTemplates" },
            { id: 93, title: "Day 93", task: "LangChain Memory" },
            { id: 94, title: "Day 94", task: "LangChain Agents + Tools" },
            { id: 95, title: "Day 95", task: "Document Loaders — PDF, CSV, URLs" },
            { id: 96, title: "Day 96", task: "Vector DBs — FAISS, Chroma, Pinecone" },
            { id: 97, title: "Day 97", task: "RAG Pipeline build" },
            { id: 98, title: "Day 98", task: "RAG — Hybrid search + evaluation" },
            { id: 'p14', title: "🏗️ Project", task: "PDF Q&A Chatbot using RAG", isProject: true }
          ]
        },
        {
          id: 15,
          title: "Week 15 — LangGraph + Streamlit",
          days: [
            { id: 99, title: "Day 99", task: "LangGraph — Nodes, Edges, State" },
            { id: 100, title: "Day 100", task: "LangGraph — Multi-step Agents" },
            { id: 101, title: "Day 101", task: "Multi-Agent + Human-in-the-loop" },
            { id: 102, title: "Day 102", task: "ML for Gen AI — LoRA, Fine-tuning basics" },
            { id: 103, title: "Day 103", task: "Vector Search deep dive" },
            { id: 104, title: "Day 104", task: "Streamlit Basics" },
            { id: 105, title: "Day 105", task: "Streamlit — Chatbot UI + API integration" }
          ]
        },
        {
          id: 16,
          title: "Week 16 — Capstone + Job Prep",
          days: [
            { id: '106-107', title: "Day 106–107", task: "Capstone 1 — ML end-to-end project" },
            { id: '108-109', title: "Day 108–109", task: "Capstone 2 — Gen AI RAG app on Streamlit" },
            { id: 110, title: "Day 110", task: "Update GitHub, LinkedIn, Resume" },
            { id: 111, title: "Day 111", task: "Interview Prep — concepts + coding" },
            { id: 112, title: "Day 112", task: "Mock Interviews" }
          ]
        }
      ],
      outcomes: []
    }
  ],

  projects: [
    { id: 'proj1', title: "Calculator / Number Game", tech: "Python" },
    { id: 'proj2', title: "Student Management System", tech: "Python OOP" },
    { id: 'proj3', title: "SQL Sales Analysis", tech: "SQL" },
    { id: 'proj4', title: "Statistical Analysis", tech: "Python, Stats" },
    { id: 'proj5', title: "EDA — Titanic/IPL", tech: "Pandas, Seaborn" },
    { id: 'proj6', title: "Sales Dashboard", tech: "Power BI" },
    { id: 'proj7', title: "Web Scraper", tech: "BeautifulSoup, Selenium" },
    { id: 'proj8', title: "ML — Price/Churn Prediction", tech: "Scikit-learn" },
    { id: 'proj9', title: "Big Data Analysis", tech: "PySpark" },
    { id: 'proj10', title: "Image Classifier", tech: "CNN, TensorFlow" },
    { id: 'proj11', title: "PDF Q&A Chatbot", tech: "LangChain, RAG" },
    { id: 'proj12', title: "Multi-Agent AI App", tech: "LangGraph, Streamlit" }
  ],

  shutdownChecklist: [
    { id: 'sd1', title: "Update tracker", desc: "Check off today's Day item(s)" },
    { id: 'sd2', title: "Write 3 bullets", desc: "What you learned, built, and what's confusing" },
    { id: 'sd3', title: "Plan tomorrow (Top 3)", desc: "Next Day task + one practice + one revision" },
    { id: 'sd4', title: "Capture links", desc: "Save the best resource you used today" },
    { id: 'sd5', title: "Backup work", desc: "Push code to GitHub (or zip it)" }
  ]
};

// ============================================================
// QUESTION BANK — Skip-Day Recovery Quiz
// Each Q has: topic, dayRange, difficulty, question, options, answer (index), explanation
// ============================================================
const QUESTION_BANK = [
  // ── Python Basics (Days 1-7) ──────────────────────────────
  { topic:"Python", dayRange:[1,7], difficulty:"easy",
    q:"What is the output of: print(type(42))?",
    opts:["<class 'str'>","<class 'int'>","<class 'float'>","<class 'bool'>"], ans:1,
    exp:"42 is an integer literal, so type() returns <class 'int'>." },
  { topic:"Python", dayRange:[1,7], difficulty:"easy",
    q:"Which of the following is a valid Python variable name?",
    opts:["2name","my_name","my-name","class"], ans:1,
    exp:"Variable names can't start with digits, can't use hyphens, and 'class' is a reserved keyword." },
  { topic:"Python", dayRange:[1,7], difficulty:"easy",
    q:"What does `len([1, 2, 3, 4])` return?",
    opts:["3","4","5","Error"], ans:1,
    exp:"len() returns the number of items. The list has 4 items." },
  { topic:"Python", dayRange:[1,7], difficulty:"medium",
    q:"What is the output of: print([1,2,3][::-1])?",
    opts:["[1,2,3]","[3,2,1]","[3]","Error"], ans:1,
    exp:"[::-1] reverses the list using step -1 slicing." },
  { topic:"Python", dayRange:[1,7], difficulty:"medium",
    q:"What does `set([1,1,2,2,3])` produce?",
    opts:["{1,1,2,2,3}","{1,2,3}","[1,2,3]","Error"], ans:1,
    exp:"Sets store only unique values, so duplicates are removed." },
  { topic:"Python", dayRange:[1,7], difficulty:"hard",
    q:"What is the output?\n```\nd = {'a':1,'b':2}\nprint(d.get('c', 99))\n```",
    opts:["None","KeyError","99","0"], ans:2,
    exp:"dict.get(key, default) returns the default value if key doesn't exist." },

  // ── Python Intermediate (Days 8-14) ──────────────────────
  { topic:"Python OOP", dayRange:[8,14], difficulty:"easy",
    q:"What keyword is used to define a function in Python?",
    opts:["function","def","func","define"], ans:1,
    exp:"Python uses the 'def' keyword to define functions." },
  { topic:"Python OOP", dayRange:[8,14], difficulty:"easy",
    q:"Which is the correct use of *args?",
    opts:["def f(*args): return args[0]","def f(args*): pass","def f(**args): pass","def f(args): pass"], ans:0,
    exp:"*args packs extra positional arguments into a tuple." },
  { topic:"Python OOP", dayRange:[8,14], difficulty:"medium",
    q:"What does `list(map(lambda x: x**2, [1,2,3]))` return?",
    opts:["[1,4,9]","[2,4,6]","[1,2,3]","Error"], ans:0,
    exp:"map applies the lambda to each element: 1²=1, 2²=4, 3²=9." },
  { topic:"Python OOP", dayRange:[8,14], difficulty:"medium",
    q:"In OOP, what does `__init__` do?",
    opts:["Destroys the object","Initializes instance attributes","Returns instance type","Defines class methods"], ans:1,
    exp:"__init__ is the constructor — it runs when a new object is created." },
  { topic:"Python OOP", dayRange:[8,14], difficulty:"hard",
    q:"What is the output?\n```\nclass A:\n  def greet(self): return 'A'\nclass B(A):\n  def greet(self): return 'B'\nb = B()\nprint(b.greet())\n```",
    opts:["A","B","AB","Error"], ans:1,
    exp:"Method overriding — B.greet() overrides A.greet(), so 'B' is printed." },
  { topic:"Python OOP", dayRange:[8,14], difficulty:"hard",
    q:"What will `list(filter(lambda x: x%2==0, range(10)))` return?",
    opts:["[1,3,5,7,9]","[0,2,4,6,8]","[2,4,6,8,10]","[0,1,2,3,4]"], ans:1,
    exp:"filter keeps elements where the lambda is True. Even numbers from 0-9: 0,2,4,6,8." },

  // ── SQL (Days 15-21) ─────────────────────────────────────
  { topic:"SQL", dayRange:[15,21], difficulty:"easy",
    q:"Which SQL keyword retrieves data from a table?",
    opts:["INSERT","UPDATE","SELECT","DELETE"], ans:2,
    exp:"SELECT is used to query/retrieve data from tables." },
  { topic:"SQL", dayRange:[15,21], difficulty:"easy",
    q:"What does WHERE do in SQL?",
    opts:["Sorts results","Filters rows","Groups rows","Joins tables"], ans:1,
    exp:"WHERE filters rows based on a condition before grouping/selecting." },
  { topic:"SQL", dayRange:[15,21], difficulty:"medium",
    q:"Which JOIN returns all rows from both tables, with NULLs where no match?",
    opts:["INNER JOIN","LEFT JOIN","RIGHT JOIN","FULL OUTER JOIN"], ans:3,
    exp:"FULL OUTER JOIN returns all rows from both sides, filling NULLs where there's no match." },
  { topic:"SQL", dayRange:[15,21], difficulty:"medium",
    q:"What is the correct order of SQL clauses?",
    opts:["WHERE → FROM → SELECT","SELECT → FROM → WHERE","FROM → WHERE → SELECT","SELECT → WHERE → FROM"], ans:1,
    exp:"The logical order is SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY." },
  { topic:"SQL", dayRange:[15,21], difficulty:"hard",
    q:"What does this return?\n```sql\nSELECT dept, COUNT(*) FROM employees GROUP BY dept HAVING COUNT(*) > 5\n```",
    opts:["All departments","Depts with >5 employees","Employees in >5 depts","Error"], ans:1,
    exp:"HAVING filters grouped results — here it keeps only departments with more than 5 employees." },
  { topic:"SQL", dayRange:[15,21], difficulty:"hard",
    q:"What does RANK() OVER (PARTITION BY dept ORDER BY salary DESC) do?",
    opts:["Sorts the table","Assigns a rank within each department by salary (desc)","Counts employees","Creates a new table"], ans:1,
    exp:"RANK() is a window function. PARTITION BY groups by dept, ORDER BY sets the ranking order." },

  // ── Statistics (Days 22-28) ───────────────────────────────
  { topic:"Statistics", dayRange:[22,28], difficulty:"easy",
    q:"What is the median of [3, 1, 4, 1, 5, 9, 2, 6]?",
    opts:["3.5","4","3","4.5"], ans:0,
    exp:"Sorted: [1,1,2,3,4,5,6,9]. Middle two: 3 and 4. Median = (3+4)/2 = 3.5" },
  { topic:"Statistics", dayRange:[22,28], difficulty:"easy",
    q:"A p-value < 0.05 means?",
    opts:["Accept null hypothesis","Reject null hypothesis","No conclusion","Data is wrong"], ans:1,
    exp:"p < 0.05 means the result is statistically significant — we reject H₀." },
  { topic:"Statistics", dayRange:[22,28], difficulty:"medium",
    q:"Which test compares means of two independent groups?",
    opts:["Chi-square","ANOVA","Independent t-test","Pearson correlation"], ans:2,
    exp:"Independent samples t-test compares means between two separate groups." },
  { topic:"Statistics", dayRange:[22,28], difficulty:"hard",
    q:"In Bayes' Theorem P(A|B) = P(B|A)P(A)/P(B), what is P(A|B)?",
    opts:["Prior probability","Posterior probability","Likelihood","Marginal probability"], ans:1,
    exp:"P(A|B) is the POSTERIOR — the updated probability of A given we observed B." },

  // ── NumPy & Pandas (Days 29-35) ──────────────────────────
  { topic:"NumPy/Pandas", dayRange:[29,35], difficulty:"easy",
    q:"What does `np.array([1,2,3]).shape` return?",
    opts:["(1,3)","(3,)","[3]","3"], ans:1,
    exp:"A 1D array of 3 elements has shape (3,) — a tuple with one dimension." },
  { topic:"NumPy/Pandas", dayRange:[29,35], difficulty:"easy",
    q:"How do you read a CSV file in Pandas?",
    opts:["pd.read_csv('file.csv')","pd.open('file.csv')","pd.load_csv('file.csv')","pd.import_csv('file.csv')"], ans:0,
    exp:"pd.read_csv() is the standard Pandas function to read CSV files." },
  { topic:"NumPy/Pandas", dayRange:[29,35], difficulty:"medium",
    q:"What does `df.dropna()` do?",
    opts:["Drops all columns","Removes rows with NaN values","Fills NaN with 0","Sorts the DataFrame"], ans:1,
    exp:"dropna() removes any rows (by default) that contain at least one NaN value." },
  { topic:"NumPy/Pandas", dayRange:[29,35], difficulty:"medium",
    q:"What is broadcasting in NumPy?",
    opts:["Sending data over network","Operating on arrays of different shapes","Copying arrays","Sorting arrays"], ans:1,
    exp:"Broadcasting allows NumPy to perform arithmetic on arrays with different shapes by expanding the smaller one." },
  { topic:"NumPy/Pandas", dayRange:[29,35], difficulty:"hard",
    q:"What does `df.groupby('city')['sales'].sum()` return?",
    opts:["Total sales for all cities","Sales per row","Sum of sales grouped by city","Error"], ans:2,
    exp:"groupby groups rows by 'city', then .sum() aggregates 'sales' for each city group." },

  // ── ML (Days 57-70) ──────────────────────────────────────
  { topic:"Machine Learning", dayRange:[57,70], difficulty:"easy",
    q:"Which algorithm draws a line to separate two classes?",
    opts:["K-Means","Logistic Regression","DBSCAN","PCA"], ans:1,
    exp:"Logistic Regression is a classification algorithm that finds a decision boundary (hyperplane)." },
  { topic:"Machine Learning", dayRange:[57,70], difficulty:"easy",
    q:"What is overfitting?",
    opts:["Model too simple","Model learns noise/training data too well","Low training accuracy","Missing data"], ans:1,
    exp:"Overfitting: model memorizes training data including noise, performs poorly on new data." },
  { topic:"Machine Learning", dayRange:[57,70], difficulty:"medium",
    q:"What does cross-validation help prevent?",
    opts:["Data leakage","Overfitting","Underfitting","Both overfitting and underfitting"], ans:3,
    exp:"Cross-validation gives a more reliable estimate of model performance, helping detect both over- and underfitting." },
  { topic:"Machine Learning", dayRange:[57,70], difficulty:"medium",
    q:"Random Forest builds many trees and uses which strategy?",
    opts:["Boosting","Bagging","Stacking","Voting only"], ans:1,
    exp:"Random Forest uses Bagging (Bootstrap Aggregating) — each tree is trained on a random subset of data." },
  { topic:"Machine Learning", dayRange:[57,70], difficulty:"hard",
    q:"XGBoost uses which strategy to build trees?",
    opts:["Bagging — parallel trees","Boosting — sequential trees correcting errors","Random subsets only","Deep neural approach"], ans:1,
    exp:"XGBoost uses gradient boosting — each new tree corrects the residual errors of the previous ensemble." },

  // ── Deep Learning (Days 78-84) ───────────────────────────
  { topic:"Deep Learning", dayRange:[78,84], difficulty:"easy",
    q:"What is an activation function used for in neural networks?",
    opts:["Initialize weights","Introduce non-linearity","Reduce overfitting","Normalize inputs"], ans:1,
    exp:"Activation functions introduce non-linearity, allowing networks to learn complex patterns." },
  { topic:"Deep Learning", dayRange:[78,84], difficulty:"medium",
    q:"What problem does Dropout solve?",
    opts:["Underfitting","Vanishing gradient","Overfitting","Slow training"], ans:2,
    exp:"Dropout randomly deactivates neurons during training, acting as regularization to prevent overfitting." },
  { topic:"Deep Learning", dayRange:[78,84], difficulty:"hard",
    q:"In CNN, what does max pooling do?",
    opts:["Adds parameters","Reduces spatial dimensions by taking the max in a region","Normalizes activations","Increases depth"], ans:1,
    exp:"Max pooling reduces spatial size (height×width) by selecting the maximum value from each pooling window." },

  // ── NLP/LLM (Days 85-98) ─────────────────────────────────
  { topic:"NLP/LLMs", dayRange:[85,98], difficulty:"easy",
    q:"What does TF-IDF stand for?",
    opts:["Text Frequency-Inverse Document Frequency","Term Frequency-Inverse Document Frequency","Token Frequency-IDF","Term Frequency-Index Data Format"], ans:1,
    exp:"TF-IDF = Term Frequency × Inverse Document Frequency — measures word importance in a document." },
  { topic:"NLP/LLMs", dayRange:[85,98], difficulty:"medium",
    q:"What is a token in NLP?",
    opts:["A sentence","A paragraph","A unit of text (word, subword, or char)","A document"], ans:2,
    exp:"A token is the smallest meaningful unit — could be a word, subword (BPE), or character depending on the tokenizer." },
  { topic:"NLP/LLMs", dayRange:[85,98], difficulty:"hard",
    q:"What is RAG (Retrieval-Augmented Generation)?",
    opts:["Training LLMs from scratch","Combining retrieval of relevant docs with LLM generation","Fine-tuning on domain data","Prompt engineering only"], ans:1,
    exp:"RAG retrieves relevant documents from a vector store and passes them as context to an LLM for grounded generation." },

  // ── General DS (any day) ─────────────────────────────────
  { topic:"Data Science", dayRange:[1,112], difficulty:"easy",
    q:"What does EDA stand for?",
    opts:["Exploratory Data Analysis","Enhanced Data Algorithm","Efficient Data Architecture","Extended Data Analysis"], ans:0,
    exp:"EDA — Exploratory Data Analysis — is the process of analyzing datasets to summarize their main characteristics." },
  { topic:"Data Science", dayRange:[1,112], difficulty:"medium",
    q:"Which Python library is primarily used for data visualization?",
    opts:["NumPy","Pandas","Matplotlib","Scikit-learn"], ans:2,
    exp:"Matplotlib is the foundational plotting library. Seaborn builds on top of it for statistical plots." },
  { topic:"Data Science", dayRange:[1,112], difficulty:"hard",
    q:"What is the curse of dimensionality?",
    opts:["Too many rows","Performance degradation as features increase","Low variance","Overfitting in small datasets"], ans:1,
    exp:"As dimensions (features) increase, data becomes sparse and distances become less meaningful, hurting ML models." }
];

// ── Motivational Quotes ────────────────────────────────────
const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Every expert was once a beginner.", author: "Helen Hayes" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Anonymous" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "Don't watch the clock; do what it does — keep going.", author: "Sam Levenson" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Data is the new oil. Refine it.", author: "Clive Humby" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The future belongs to those who learn more skills and combine them creatively.", author: "Robert Greene" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "One day at a time. One algorithm at a time.", author: "Focus Tracker" },
  { text: "Your only competition is who you were yesterday.", author: "Anonymous" }
];

// ── Focus Mode Presets ─────────────────────────────────────
const FOCUS_PRESETS = [
  { label: "Pomodoro", work: 25, break: 5, icon: "🍅" },
  { label: "Deep Work", work: 50, break: 10, icon: "🧠" },
  { label: "Flow", work: 90, break: 20, icon: "⚡" },
  { label: "Quick", work: 15, break: 5, icon: "⏱️" }
];

