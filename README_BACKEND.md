# CropIQ Backend - Smart Farming Platform

A production-ready backend for CropIQ AI-Powered Smart Farming Software, built with Supabase and designed for seamless integration with the existing React frontend.

## 🌟 Features

### Core Functionality
- **Multi-role Authentication**: Farmers, FPOs, and Admins with phone/email login
- **Crop Management**: Complete crop lifecycle tracking with growth stages
- **Weather Intelligence**: Real-time weather data with caching and forecasting
- **AI-Driven Advisories**: Personalized farming recommendations based on weather and crop data
- **Yield Prediction**: ML-ready prediction engine with confidence scoring
- **Market Intelligence**: Price tracking, trends, and predictions
- **Dashboard Analytics**: Role-based dashboards with comprehensive insights

### Technical Features
- **Supabase Integration**: PostgreSQL database with Row Level Security
- **Edge Functions**: Serverless TypeScript functions for all business logic
- **API Caching**: Efficient weather data caching to reduce external API calls
- **Scheduled Tasks**: Automated advisory generation and data updates
- **Error Handling**: Comprehensive logging and error management
- **Security**: Role-based access control and secure API endpoints

## 🏗️ Architecture

### Database Schema
- **Users & Authentication**: Profiles, roles, FPO relationships
- **Crop Management**: Crop cycles, growth stages, field data
- **Weather Data**: Cached weather information with forecasts
- **Advisories**: AI-generated recommendations with priority levels
- **Yield Predictions**: ML-ready prediction data with confidence scores
- **Market Data**: Price tracking and trend analysis
- **System Logs**: Comprehensive audit trail

### Edge Functions
- `/auth` - Authentication and user management
- `/weather` - Weather data fetching and caching
- `/advisories` - AI-driven advisory generation
- `/crop-management` - Crop lifecycle management
- `/yield-prediction` - Yield prediction algorithms
- `/market-intelligence` - Market price analysis
- `/dashboard` - Role-based dashboard data
- `/scheduler` - Automated task scheduling

## 🚀 Setup & Deployment

### Prerequisites
- Node.js 18+
- Supabase CLI
- OpenWeather API key (for weather data)

### Installation

1. **Clone and Setup**
```bash
git clone <repository-url>
cd crop-iq-smart-farming-assistant-main
npm install
```

2. **Supabase Setup**
```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase
supabase start

# Run migrations
supabase db push
```

3. **Environment Variables**
Create `.env` file:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENWEATHER_API_KEY=your_openweather_api_key
WEBHOOK_SECRET=your_webhook_secret
```

4. **Deploy Edge Functions**
```bash
supabase functions deploy auth
supabase functions deploy weather
supabase functions deploy advisories
supabase functions deploy crop-management
supabase functions deploy yield-prediction
supabase functions deploy market-intelligence
supabase functions deploy dashboard
supabase functions deploy scheduler
```

### Database Setup

The database schema is automatically created through migrations:

```bash
# Apply initial schema
supabase db push

# Seed with initial data
supabase db reset
```

## 📊 API Documentation

### Authentication Endpoints

#### Sign Up
```http
POST /functions/v1/auth
Content-Type: application/json

{
  "action": "signup",
  "email": "farmer@example.com",
  "password": "password123",
  "full_name": "John Farmer",
  "role": "farmer",
  "language": "en"
}
```

#### Sign In
```http
POST /functions/v1/auth
Content-Type: application/json

{
  "action": "signin",
  "email": "farmer@example.com",
  "password": "password123"
}
```

### Crop Management

#### Create Crop Cycle
```http
POST /functions/v1/crop-management
Authorization: Bearer <token>
Content-Type: application/json

{
  "crop_type": "rice",
  "crop_variety": "Basmati",
  "sowing_date": "2024-01-15",
  "field_size_acres": 5.0,
  "location_lat": 28.6139,
  "location_lng": 77.2090,
  "soil_type": "clay",
  "irrigation_method": "flood"
}
```

#### Get Crop Cycles
```http
GET /functions/v1/crop-management?status=active&include_yield=true
Authorization: Bearer <token>
```

### Weather Data

#### Get Weather
```http
GET /functions/v1/weather?lat=28.6139&lng=77.2090&date=2024-01-15
Authorization: Bearer <token>
```

### Advisories

#### Get Advisories
```http
GET /functions/v1/advisories?unread_only=true&type=irrigation&limit=10
Authorization: Bearer <token>
```

### Yield Prediction

#### Generate Prediction
```http
POST /functions/v1/yield-prediction
Authorization: Bearer <token>
Content-Type: application/json

{
  "crop_cycle_id": "uuid-here"
}
```

### Market Intelligence

#### Get Market Prices
```http
GET /functions/v1/market-intelligence?crop_type=rice&state=Punjab&days=30&trend=true
Authorization: Bearer <token>
```

### Dashboard Data

#### Get Dashboard
```http
GET /functions/v1/dashboard
Authorization: Bearer <token>
```

## 🔄 Scheduled Tasks

The system includes automated tasks that run periodically:

### Weather Updates
- **Frequency**: Every 6 hours
- **Purpose**: Fetch fresh weather data for all active crop locations
- **Cache Duration**: 6 hours

### Advisory Generation
- **Frequency**: Daily at 8 AM
- **Purpose**: Generate AI-driven advisories based on weather and crop data

### Yield Prediction Updates
- **Frequency**: Daily at midnight
- **Purpose**: Update yield predictions for all active crops

### Growth Stage Updates
- **Frequency**: Every 12 hours
- **Purpose**: Update crop growth stages based on days since sowing

### Market Data Updates
- **Frequency**: Daily at 6 PM
- **Purpose**: Generate mock market data for testing and demonstration

### Triggering Scheduled Tasks

#### Manual Trigger (Admin Only)
```http
POST /functions/v1/scheduler
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "task": "all"
}
```

#### Webhook Trigger
```http
POST /functions/v1/scheduler/webhook
x-signature: <webhook_secret>
Content-Type: application/json

{
  "task": "weather_update"
}
```

## 🛡️ Security Features

### Authentication & Authorization
- JWT-based authentication with Supabase Auth
- Role-based access control (Farmer, FPO, Admin)
- Row Level Security (RLS) on all sensitive tables
- Secure API endpoints with proper authorization checks

### Data Protection
- Encrypted data transmission (HTTPS)
- Environment variable protection
- Input validation and sanitization
- SQL injection prevention through parameterized queries

### Access Control
- Farmers can only access their own data
- FPOs can access data from their member farmers
- Admins have full system access
- API rate limiting and usage tracking

## 📈 Analytics & Monitoring

### System Metrics
- User registration and activity tracking
- API usage monitoring
- Weather data freshness tracking
- Advisory generation statistics

### Performance Monitoring
- Response time tracking
- Error rate monitoring
- Database query performance
- Edge function execution metrics

### Logging
- Structured logging with different levels
- System event tracking
- Error logging with context
- Audit trail for all important actions

## 🧪 Testing

### Local Development
```bash
# Start Supabase locally
supabase start

# Run functions locally
supabase functions serve --env-file .env
```

### Database Testing
```bash
# Reset database with seed data
supabase db reset

# Run specific migration
supabase db push
```

### API Testing
Use the provided Postman collection or curl commands to test all endpoints.

## 🔧 Configuration

### Environment Variables
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for admin operations
- `OPENWEATHER_API_KEY`: API key for weather data
- `WEBHOOK_SECRET`: Secret for webhook authentication

### Supabase Configuration
- Authentication providers configured for email and phone
- Storage settings for file uploads
- Database extensions enabled (PostGIS, uuid-ossp, pgcrypto)
- Row Level Security policies applied

## 🚀 Production Deployment

### Supabase Production
1. Create production Supabase project
2. Configure authentication providers
3. Apply database migrations
4. Deploy all edge functions
5. Set up environment variables
6. Configure scheduled tasks

### External Services
- OpenWeather API for weather data
- Optional: External market data APIs
- Optional: SMS gateway for phone authentication

### Monitoring & Alerting
- Set up Supabase monitoring
- Configure error alerting
- Monitor API usage and costs
- Set up backup and recovery procedures

## 📱 Frontend Integration

The backend is designed to work seamlessly with the existing React frontend:

### Authentication Flow
1. Frontend calls `/functions/v1/auth` for signup/signin
2. Receive JWT token for subsequent requests
3. Include token in Authorization header

### Data Fetching
1. Use the provided API endpoints for all data operations
2. Handle role-based permissions appropriately
3. Implement proper error handling and loading states

### Real-time Updates
1. Use Supabase realtime subscriptions for live updates
2. Listen for new advisories and weather data
3. Update UI automatically when data changes

## 🤝 Contributing

### Development Workflow
1. Create feature branch
2. Make changes with proper testing
3. Update documentation
4. Submit pull request
5. Code review and deployment

### Code Standards
- TypeScript for all edge functions
- Proper error handling and logging
- Comprehensive API documentation
- Security best practices

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the API examples
- Check system logs for errors
- Contact the development team

---

**CropIQ Backend** - Empowering farmers with AI-driven agricultural intelligence.
