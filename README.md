# PotholeTrackerCR

A modern, serverless REST API for reporting and tracking potholes in Costa Rica, built with Node.js, TypeScript, AWS CDK, Lambda, DynamoDB, S3, and API Gateway.

---

## 🚀 Project Overview
PotholeTrackerCR enables users to report, update, and view potholes by location, with support for photos and precise coordinates. The backend is fully serverless and deployable to AWS with a single command.

---

## ✨ Features
- Register potholes with province, county, district, street, and coordinates
- Attach photos to pothole reports (stored in S3)
- List all potholes with pagination
- Get details of a specific pothole
- Update pothole status and information
- API Key authentication for all endpoints
- Infrastructure as code with AWS CDK (TypeScript)
- Unit tests with Jest

---

## 🏗️ Architecture
- **API Gateway**: REST API endpoints
- **AWS Lambda**: Business logic (Node.js 18.x, TypeScript)
- **DynamoDB**: Stores pothole records
- **S3**: Stores pothole photos
- **CDK**: Infrastructure as code

---

## 📦 Project Structure
```
.
├── cdk/                # CDK infrastructure (TypeScript)
├── src/
│   ├── config/         # Environment and config
│   ├── handlers/       # Lambda handlers (API endpoints)
│   ├── models/         # TypeScript interfaces
│   ├── services/       # Business logic (DynamoDB, S3)
│   └── tests/          # Jest unit tests
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

---

## 📝 API Documentation

**Base URL:** `https://<api-id>.execute-api.<region>.amazonaws.com/prod`

### Authentication
All endpoints require an API Key:
```
x-api-key: <your-api-key>
```

### Endpoints
| Method | Endpoint                | Description                |
|--------|-------------------------|----------------------------|
| POST   | /potholes               | Register a new pothole     |
| GET    | /potholes               | List potholes (paginated)  |
| GET    | /potholes/{id}          | Get pothole by ID          |
| PUT    | /potholes/{id}          | Update pothole by ID       |
| POST   | /login                  | Login with API Key         |

#### Example: Register a Pothole
```http
POST /potholes
Headers:
  x-api-key: <your-api-key>
  Content-Type: application/json
Body:
{
  "province": "San José",
  "county": "Central",
  "district": "Carmen",
  "street": "Main Ave",
  "latitude": 9.93333,
  "longitude": -84.08333,
  "description": "Large pothole near the corner",
  "priority": "high"
}
```

#### Example: List Potholes
```http
GET /potholes?page=1&pageSize=10
Headers:
  x-api-key: <your-api-key>
```

#### Example: Update a Pothole
```http
PUT /potholes/{id}
Headers:
  x-api-key: <your-api-key>
  Content-Type: application/json
Body:
{
  "status": "in_progress",
  "description": "Being repaired"
}
```

---

## ⚙️ Setup & Development

### Prerequisites
- Node.js 18.x (LTS)
- npm
- AWS CLI configured (`aws configure`)
- AWS CDK CLI (`npm install -g aws-cdk`)

### Install dependencies
```bash
npm install
cd cdk && npm install
```

### Run tests
```bash
npm test
```

### Lint (optional)
```bash
npx eslint .
```

---

## ☁️ Deployment

### 1. Bootstrap your AWS environment (first time only)
```bash
npx aws-cdk bootstrap
```

### 2. Build and deploy
```bash
cd cdk
npm run build
npx aws-cdk deploy --require-approval never
```

### 3. Get your API Key and API URL
- After deployment, check the CloudFormation stack outputs or the AWS Console (API Gateway > API Keys)

---

## 🧪 Testing the API
You can use [Postman](https://www.postman.com/) or `curl` to test the endpoints. See the API documentation above for examples.

---

## 🤝 Contributing
1. Fork this repo
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a Pull Request

---

## 📄 License
MIT

---

## 👤 Author
josuebass09@gmail.com - Josué Hidalgo Ramírez
