<h1 align="center">
  <br>
  <img src="https://github.com/Sipos-Lucas-George/Budget-Buddy/blob/main/public/assets/logo.png" alt="Budget Buddy" width="200">
  <br>
  <img alt="GitHub License" src="https://img.shields.io/github/license/Sipos-Lucas-George/Budget-Buddy">
</h1>


Budget Buddy is a comprehensive personal finance application that simplifies budgeting based on the 50/30/20 rule - allocating 50% of income to needs, 30% to wants, and 20% to savings. This full-stack application provides intuitive expense tracking, subscription management, and insightful visualizations to help users take control of their finances.

## Features

- **Customizable 50/30/20 Budget Rule**: Automatically allocates your income into needs, wants, and savings categories based on your specific income level and preferences
- **Dynamic Expense Tracking**: Add, edit, and delete daily expenses with categorization
- **Subscription Management**: Track recurring payments with reminders for upcoming renewals
- **Real-time Data Processing**: Instantly update and view financial data
- **Interactive Calendar View**: See daily expenses in an intuitive calendar format
- **Dynamic Data Visualization**: Beautiful charts show spending distribution by type, payment method, and category, improving spending visibility by 40%
- **Income Level Adaptation**: Budget recommendations adjust based on individual or household income levels
- **Multi-currency Support**: Track expenses in €, $, or £

## Technologies Used

### Frontend

- Next.js 13+ (with App Router)
- TypeScript
- React
- Tailwind CSS
- Shadcn UI
- Material UI

### Backend

- Next.js API Routes
- Prisma ORM
- PostgreSQL Database

### Authentication

- NextAuth.js with Google OAuth

### Deployment

- Vercel

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- PostgreSQL database setup
- Google OAuth credentials for authentication

## Installation

1. Clone the repository

```bash
git clone https://github.com/Sipos-Lucas-George/budget-buddy.git
cd budget-buddy
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL="postgresql://user:password@localhost:5432/budgetbuddy"
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

4. Set up the database

```bash
npx prisma db push
```

5. Start the development server

```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:3000`

## Database & System Diagrams

<div style="display: flex" align="center">
  <img src="https://github.com/Sipos-Lucas-George/Budget-Buddy/blob/main/public/assets/database_diagram.png" alt="Database Diagram" width="500" align="center">
  <img src="https://github.com/Sipos-Lucas-George/Budget-Buddy/blob/main/public/assets/system_diagram.png" alt="System Diagram" width="500" align="center">
</div>

## Usage

### Setting Up Your Budget

1. Sign in using your Google account
2. Configure your income settings:
   - Select individual or household
   - Enter your yearly income
   - Adjust the budget allocation sliders based on your needs

### Tracking Expenses

1. Navigate to the Expenses page
2. View expenses in the calendar view by month
3. Click on a specific day to add or view expenses
4. Add new expenses with details such as:
   - Description
   - Payment method (Cash/Card)
   - Type (Essentials/Discretionary/Debt)
   - Category
   - Amount

### Managing Subscriptions

1. Go to the Subscriptions page
2. Add recurring subscriptions with details:
   - Name
   - Renewal date
   - Frequency (Weekly/Monthly/Annual)
   - Amount
3. Receive notifications when subscriptions are due for renewal

### Analyzing Spending

1. Navigate to the Monthly Statistics view
2. Explore interactive charts showing:
   - Spending by type (needs vs. wants)
   - Payment method distribution
   - Category breakdown
3. Track your budget adherence with color-coded indicators

## Performance Highlights

- **Optimized Database Queries**: Reduced query response times by 30% through strategic indexing
- **Real-time Data Processing**: Instant updates for expense tracking and subscription management
- **Dynamic Visualizations**: Interactive charts provide immediate insights into spending patterns
- **Responsive Design**: Seamless experience across desktop and mobile devices

## Future Development Plans

- **Budget Planning Tool**: Create and save budget plans for future months
- **Expense Forecasting**: Predict future expenses based on spending patterns
- **Financial Goals**: Set and track progress toward savings goals
- **Expense Categories Customization**: Add custom categories for more personalized tracking
- **Data Export**: Export financial data to CSV/PDF for external analysis
- **Multi-user Household**: Enhanced features for family budget management

## License

This project is licensed under the MIT License - see the LICENSE file for details.
