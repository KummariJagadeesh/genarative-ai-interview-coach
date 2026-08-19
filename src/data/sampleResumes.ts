import { ResumeAnalysis } from '../types';

export interface PresetResume {
  id: string;
  name: string;
  targetRole: string;
  subtitle: string;
  experienceLevel: string;
  rawText: string;
  analysis: ResumeAnalysis;
}

export const PRESET_RESUMES: PresetResume[] = [
  {
    id: 'fullstack-dev',
    name: 'Alex Rivera',
    targetRole: 'Full Stack Software Engineer',
    subtitle: 'React, Node.js, TypeScript, PostgreSQL, REST/GraphQL, AWS',
    experienceLevel: 'Entry-to-Mid (2 Years)',
    rawText: `ALEX RIVERA
Full Stack Software Engineer | San Francisco, CA | alex.rivera@example.com | (555) 234-5678 | github.com/alexrivera-dev

PROFESSIONAL SUMMARY
Motivated Full Stack Developer with 2+ years of hands-on experience designing, developing, and deploying scalable web applications using React, TypeScript, Node.js, Express, and PostgreSQL. Passionate about building performant user interfaces, microservices architecture, and CI/CD automation pipelines.

EDUCATION
B.S. in Computer Science | University of California, Berkeley | 2020 - 2024 | GPA: 3.82 / 4.0

TECHNICAL SKILLS
- Frontend: React 18, TypeScript, Next.js, Redux Toolkit, Tailwind CSS, HTML5, CSS3, Webpack/Vite
- Backend: Node.js, Express.js, Python, FastAPI, RESTful APIs, GraphQL, WebSocket
- Databases: PostgreSQL, MongoDB, Redis, Prisma ORM
- DevOps & Tools: Docker, AWS (EC2, S3, RDS), Git, GitHub Actions, Jest, Cypress, Postman

WORK EXPERIENCE
Full Stack Engineering Intern | TechNova Systems | June 2023 - May 2024
- Built responsive customer analytics dashboard in React and TypeScript, boosting client user engagement by 34%.
- Architected REST API microservices in Node.js and PostgreSQL handling 50k+ daily queries with sub-120ms response times.
- Optimized Redis caching layer, reducing SQL database load by 45% during peak traffic spikes.
- Integrated automated testing with Jest and GitHub Actions, increasing test coverage from 62% to 88%.

KEY PROJECTS
1. CloudCollaborate - Real-time Collaborative Code Editor
- Built a multi-user code workspace using React, Monaco Editor, WebSockets, and Node.js.
- Implemented Operational Transformation algorithms for simultaneous conflict-free live code editing.
- Containerized using Docker and deployed on AWS EC2 with automatic SSL management.

2. AI E-Commerce Recommendation Engine
- Created a recommendation platform utilizing Next.js, Express, MongoDB, and vector similarity search.
- Handled Stripe payment checkout workflows and webhook event processing.

CERTIFICATIONS
- AWS Certified Solutions Architect - Associate (2024)
- Meta Frontend Developer Professional Certificate (2023)`,
    analysis: {
      candidateName: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      phone: '(555) 234-5678',
      summary: 'Motivated Full Stack Developer with 2+ years of hands-on experience designing and deploying scalable web applications using React, TypeScript, Node.js, Express, and PostgreSQL.',
      education: [
        {
          degree: 'B.S. in Computer Science',
          institution: 'University of California, Berkeley',
          year: '2020 - 2024',
          gpaOrGrade: '3.82 / 4.0'
        }
      ],
      workExperience: [
        {
          title: 'Full Stack Engineering Intern',
          company: 'TechNova Systems',
          duration: 'June 2023 - May 2024',
          highlights: [
            'Built responsive analytics dashboard in React & TypeScript boosting engagement by 34%',
            'Architected REST API microservices in Node.js and PostgreSQL handling 50k+ daily queries',
            'Implemented Redis caching layer reducing database load by 45%',
            'Engineered CI/CD testing pipeline increasing code coverage to 88%'
          ]
        }
      ],
      technicalSkills: [
        'React', 'TypeScript', 'Node.js', 'Express.js', 'PostgreSQL', 'Next.js', 'REST APIs', 'GraphQL', 'WebSockets', 'Python', 'Tailwind CSS', 'Redux'
      ],
      softSkills: [
        'Problem Solving', 'Agile Team Collaboration', 'Technical Communication', 'Code Review Practices', 'Adaptability'
      ],
      toolsAndFrameworks: [
        'Docker', 'AWS (EC2, S3, RDS)', 'Git & GitHub Actions', 'Prisma ORM', 'Redis', 'Jest', 'Vite'
      ],
      certifications: [
        'AWS Certified Solutions Architect - Associate',
        'Meta Frontend Developer Professional Certificate'
      ],
      projects: [
        {
          name: 'CloudCollaborate - Real-time Code Editor',
          description: 'Multi-user workspace using React, WebSockets, and Node.js with Operational Transformation algorithms.',
          technologies: ['React', 'WebSockets', 'Node.js', 'Docker', 'AWS EC2'],
          outcomes: 'Supported simultaneous conflict-free live collaboration across 20+ active rooms.'
        },
        {
          name: 'AI E-Commerce Recommendation Engine',
          description: 'Full stack shopping platform with vector similarity search and Stripe checkout webhooks.',
          technologies: ['Next.js', 'Express', 'MongoDB', 'Stripe API'],
          outcomes: 'Delivered sub-100ms personalized product suggestions.'
        }
      ],
      strengths: [
        'Robust full-stack grasp from frontend state management to backend database optimization',
        'Strong practical experience with real-time systems (WebSockets) and cloud deployment (AWS/Docker)',
        'Demonstrated commitment to automated testing and clean CI/CD development practices'
      ],
      areasForImprovement: [
        'Deepen understanding of distributed systems and microservices fault tolerance (Circuit Breakers)',
        'Expand hands-on experience with Kubernetes and infrastructure-as-code (Terraform)'
      ],
      recommendedJobRoles: [
        {
          id: 'role-fs-1',
          roleTitle: 'Full Stack Software Engineer',
          matchScore: 95,
          category: 'Software Engineering',
          experienceLevel: 'Entry to Mid Level (1-3 yrs)',
          summary: 'Ideal match based on verified end-to-end expertise in React, TypeScript, Node.js, and SQL database design.',
          requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'REST/GraphQL APIs', 'Docker', 'Git'],
          matchedSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'REST APIs', 'Docker', 'Git'],
          missingSkills: ['Kubernetes', 'CI/CD pipeline hardening'],
          interviewFocusTopics: [
            'Component lifecycle & state management in React',
            'Node.js event loop & asynchronous concurrency',
            'Database indexing, normalization, and ACID transactions',
            'REST API security & rate limiting strategies',
            'Real-time WebSocket protocol architecture'
          ],
          averageSalaryRange: '$95,000 - $135,000',
          growthOutlook: 'Very High (+22% YoY)'
        },
        {
          id: 'role-fs-2',
          roleTitle: 'Frontend Engineer (React / TypeScript)',
          matchScore: 92,
          category: 'Frontend Engineering',
          experienceLevel: 'Junior to Mid Level',
          summary: 'High suitability for modern web application frontend roles with deep UI performance and state architecture.',
          requiredSkills: ['React', 'TypeScript', 'CSS/Tailwind', 'State Management', 'Web Performance Optimization'],
          matchedSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Redux Toolkit', 'Vite'],
          missingSkills: ['Microfrontends', 'Accessibility (a11y) audit tooling'],
          interviewFocusTopics: [
            'React Virtual DOM and reconciliation engine',
            'Custom hooks & TypeScript generics',
            'Core Web Vitals optimization and bundle splitting',
            'State normalization and caching strategies'
          ],
          averageSalaryRange: '$90,000 - $130,000',
          growthOutlook: 'High (+18% YoY)'
        },
        {
          id: 'role-fs-3',
          roleTitle: 'Backend API & Cloud Engineer',
          matchScore: 88,
          category: 'Backend & Cloud',
          experienceLevel: 'Junior to Mid Level',
          summary: 'Strong foundation for backend services, database schema design, and AWS cloud deployment.',
          requiredSkills: ['Node.js', 'Express/FastAPI', 'PostgreSQL', 'Redis', 'AWS', 'Docker'],
          matchedSkills: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'AWS', 'Docker'],
          missingSkills: ['Message Queues (Kafka/RabbitMQ)', 'System Design at Scale'],
          interviewFocusTopics: [
            'Database query optimization & transaction isolation',
            'Distributed caching strategies with Redis',
            'Authentication (JWT/OAuth) and API gateway patterns',
            'Handling concurrent requests and connection pooling'
          ],
          averageSalaryRange: '$98,000 - $140,000',
          growthOutlook: 'High (+20% YoY)'
        }
      ]
    }
  },
  {
    id: 'ai-data-scientist',
    name: 'Priya Sharma',
    targetRole: 'Data Scientist / AI Engineer',
    subtitle: 'Python, PyTorch, Scikit-Learn, NLP, LLMs, SQL, Pandas, ML Pipelines',
    experienceLevel: 'Entry-to-Mid (1.5 Years)',
    rawText: `PRIYA SHARMA
AI & Data Science Specialist | Seattle, WA | priya.sharma@example.com | (555) 890-1234 | linkedin.com/in/priyasharma-ai

PROFESSIONAL SUMMARY
Data Scientist and Machine Learning Engineer experienced in statistical modeling, deep learning, NLP, and LLM fine-tuning. Skilled in Python, PyTorch, Hugging Face, Scikit-Learn, and SQL for delivering actionable data intelligence.

EDUCATION
M.S. in Data Science | University of Washington | 2023 - 2025 | GPA: 3.90
B.Tech in Information Technology | 2019 - 2023

SKILLS
- Machine Learning: PyTorch, TensorFlow, Scikit-Learn, XGBoost, Hugging Face Transformers, LangChain
- Data Analysis: Python (Pandas, NumPy, SciPy), SQL, Spark, Tableau, Matplotlib, Seaborn
- NLP & GenAI: Prompt Engineering, RAG Architectures, Vector Databases (Pinecone, ChromaDB), Tokenization
- Deployment: FastAPI, Docker, MLflow, AWS Sagemaker, Git

EXPERIENCE
Machine Learning Intern | DataCore Labs | June 2024 - Dec 2024
- Engineered an end-to-end RAG question-answering pipeline using LangChain, ChromaDB, and OpenAI/Gemini embeddings, improving document retrieval accuracy by 28%.
- Developed a customer churn prediction model using XGBoost with an AUC-ROC of 0.91, identifying at-risk accounts.
- Automated data ingestion pipelines with PySpark processing 2TB+ daily log telemetry.`,
    analysis: {
      candidateName: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '(555) 890-1234',
      summary: 'Data Scientist and Machine Learning Engineer with expertise in deep learning, NLP pipelines, RAG systems, and statistical modeling using Python, PyTorch, and SQL.',
      education: [
        {
          degree: 'M.S. in Data Science',
          institution: 'University of Washington',
          year: '2023 - 2025',
          gpaOrGrade: '3.90 / 4.0'
        }
      ],
      workExperience: [
        {
          title: 'Machine Learning Intern',
          company: 'DataCore Labs',
          duration: 'June 2024 - Dec 2024',
          highlights: [
            'Built enterprise RAG Q&A system using LangChain, ChromaDB, and embeddings',
            'Developed XGBoost churn model achieving 0.91 AUC-ROC',
            'Built PySpark automated data preprocessing pipeline for 2TB+ logs'
          ]
        }
      ],
      technicalSkills: [
        'Python', 'PyTorch', 'Scikit-Learn', 'SQL', 'Hugging Face', 'NLP', 'RAG Architectures', 'Pandas', 'NumPy', 'FastAPI', 'Vector Databases'
      ],
      softSkills: [
        'Data Storytelling', 'Hypothesis Testing', 'Cross-Functional Collaboration', 'Analytical Problem Solving'
      ],
      toolsAndFrameworks: [
        'LangChain', 'Docker', 'MLflow', 'ChromaDB', 'Tableau', 'AWS Sagemaker', 'Git'
      ],
      certifications: [
        'TensorFlow Developer Certificate',
        'DeepLearning.AI Generative AI Specialization'
      ],
      projects: [
        {
          name: 'Enterprise Document Intelligence via RAG',
          description: 'Semantic search and question answering on PDF collections with chunking and hybrid dense-sparse retrieval.',
          technologies: ['Python', 'LangChain', 'ChromaDB', 'FastAPI'],
          outcomes: 'Boosted search query precision by 28% across 10,000+ internal research papers.'
        }
      ],
      strengths: [
        'Deep practical knowledge of modern GenAI (RAG, embeddings, vector search)',
        'Strong statistical foundations and machine learning evaluation metrics',
        'Demonstrated ability to deploy ML models via REST APIs'
      ],
      areasForImprovement: [
        'Further explore low-level model quantization and ONNX runtime optimization',
        'Strengthen distributed model training experience across multi-GPU clusters'
      ],
      recommendedJobRoles: [
        {
          id: 'role-ai-1',
          roleTitle: 'AI / Machine Learning Engineer',
          matchScore: 96,
          category: 'Artificial Intelligence',
          experienceLevel: 'Entry to Mid Level',
          summary: 'Superb match for GenAI, LLM application development, RAG systems, and predictive modeling.',
          requiredSkills: ['Python', 'PyTorch', 'NLP', 'Transformers', 'FastAPI', 'Vector DBs', 'SQL'],
          matchedSkills: ['Python', 'PyTorch', 'NLP', 'Transformers', 'FastAPI', 'Vector DBs', 'SQL'],
          missingSkills: ['Distributed Training (DeepSpeed)', 'Triton Inference Server'],
          interviewFocusTopics: [
            'Attention mechanism & Transformer architecture fundamentals',
            'RAG pipeline design: chunking strategies, embeddings, reranking',
            'Bias-variance tradeoff, regularization, and hyperparameter tuning',
            'Model evaluation metrics: Precision, Recall, F1, ROC-AUC, BLEU/ROUGE',
            'Serving ML models with FastAPI & low latency constraints'
          ],
          averageSalaryRange: '$105,000 - $150,000',
          growthOutlook: 'Explosive (+35% YoY)'
        },
        {
          id: 'role-ai-2',
          roleTitle: 'Data Scientist',
          matchScore: 91,
          category: 'Data Science & Analytics',
          experienceLevel: 'Junior to Mid Level',
          summary: 'Strong fit for statistical modeling, exploratory data analysis, and predictive business insights.',
          requiredSkills: ['Python', 'SQL', 'Scikit-Learn', 'Statistics & A/B Testing', 'Data Visualization'],
          matchedSkills: ['Python', 'SQL', 'Scikit-Learn', 'Pandas', 'Tableau'],
          missingSkills: ['Causal Inference', 'Advanced A/B Testing experimentation design'],
          interviewFocusTopics: [
            'Hypothesis testing, p-values, and statistical power analysis',
            'Feature engineering & handling missing/imbalanced data',
            'Supervised vs Unsupervised algorithms comparison',
            'Translating raw machine learning outputs into executive business decisions'
          ],
          averageSalaryRange: '$95,000 - $138,000',
          growthOutlook: 'Very High (+24% YoY)'
        }
      ]
    }
  }
];
