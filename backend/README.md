# Smart Library Management System - Backend

A comprehensive library management system backend built with **Java Spring Boot** that provides complete functionality for managing books, users, fines, and library operations in a college environment.

## 🚀 Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with role-based access control
- **Multi-role support**: Admin, Librarian, Student
- **Secure password encryption** using BCrypt
- **Token refresh** and validation endpoints

### 📚 Book Management
- **Complete CRUD operations** for books
- **Advanced search and filtering** by department, subject, author
- **Book availability tracking** (available, issued, reserved)
- **ISBN validation** and duplicate prevention
- **Book categorization** by academic departments

### 👥 User Management
- **Student registration** with roll number validation
- **User profile management** with academic details
- **Department-wise user organization**
- **User status management** (active, suspended, graduated)

### 📖 Book Issue & Return System
- **Book borrowing** with due date tracking
- **Renewal system** with configurable limits
- **Return processing** with fine calculation
- **Overdue book tracking** and notifications

### 💰 Fine Management
- **Automatic fine calculation** for overdue books
- **Flexible fine rates** (₹5/day configurable)
- **Payment processing** and tracking
- **Fine waiver** and discount system
- **Comprehensive fine reporting**

### 📋 Book Request System
- **Student book requests** with priority levels
- **Librarian approval workflow**
- **Request status tracking** (pending, approved, rejected, fulfilled)
- **Automated notifications** for request updates

### 🔔 Notification System
- **Real-time notifications** for due dates, overdue books
- **Email notifications** for important events
- **Notification categorization** by type and priority
- **Mark as read/unread** functionality

### 📊 Analytics & Reporting
- **Dashboard statistics** for all user roles
- **Department-wise analytics**
- **Monthly/yearly reports**
- **User activity tracking**
- **Popular books analysis**

## 🛠️ Technology Stack

- **Framework**: Spring Boot 3.2.1
- **Language**: Java 17
- **Database**: H2 (development), MySQL (production ready)
- **Security**: Spring Security with JWT
- **ORM**: Spring Data JPA with Hibernate
- **Documentation**: Swagger/OpenAPI 3
- **Build Tool**: Maven
- **Testing**: JUnit 5, Spring Boot Test

## 📁 Project Structure

```
backend/
├── src/main/java/com/library/management/
│   ├── config/          # Configuration classes
│   ├── controller/      # REST API controllers
│   ├── dto/            # Data Transfer Objects
│   ├── entity/         # JPA entities
│   ├── exception/      # Custom exceptions
│   ├── repository/     # Data access layer
│   ├── security/       # Security configuration
│   ├── service/        # Business logic layer
│   └── util/           # Utility classes
├── src/main/resources/
│   ├── application.yml # Application configuration
│   └── data.sql       # Initial data (optional)
└── pom.xml            # Maven dependencies
```

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   mvn clean install
   ```

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

4. **Access the application**
   - API Base URL: `http://localhost:8080/api`
   - Swagger UI: `http://localhost:8080/swagger-ui.html`
   - H2 Console: `http://localhost:8080/h2-console`

## 🔑 Demo Accounts

The system comes with pre-configured demo accounts:

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| **Admin** | admin@demo.com | demo123 | Full system access |
| **Librarian** | librarian@demo.com | demo123 | Book management, user management |
| **Student** | user@demo.com | demo123 | Book browsing, borrowing |

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/login              # User login
POST /api/auth/register/student   # Student registration
POST /api/auth/refresh            # Refresh JWT token
POST /api/auth/logout             # User logout
```

### Book Management
```
GET    /api/books                 # Get all books
GET    /api/books/{id}            # Get book by ID
POST   /api/books                 # Add new book (Librarian/Admin)
PUT    /api/books/{id}            # Update book (Librarian/Admin)
DELETE /api/books/{id}            # Delete book (Admin)
GET    /api/books/search          # Search books
```

### User Management
```
GET    /api/users                 # Get all users (Admin)
GET    /api/users/{id}            # Get user by ID
PUT    /api/users/{id}            # Update user
DELETE /api/users/{id}            # Delete user (Admin)
GET    /api/users/search          # Search users
```

### Book Issues
```
POST   /api/issues               # Issue book (Librarian)
PUT    /api/issues/{id}/return   # Return book (Librarian)
PUT    /api/issues/{id}/renew    # Renew book (Librarian)
GET    /api/issues/user/{id}     # Get user's issues
```

### Fine Management
```
GET    /api/fines                # Get all fines
GET    /api/fines/user/{id}      # Get user's fines
POST   /api/fines/{id}/pay       # Pay fine
PUT    /api/fines/{id}/waive     # Waive fine (Admin)
```

## ⚙️ Configuration

### Database Configuration
```yaml
spring:
  datasource:
    url: jdbc:h2:mem:librarydb    # H2 for development
    # url: jdbc:mysql://localhost:3306/library_db  # MySQL for production
    username: sa
    password: password
```

### JWT Configuration
```yaml
jwt:
  secret: mySecretKey123456789012345678901234567890
  expiration: 86400000  # 24 hours
```

### Library Rules Configuration
```yaml
library:
  fine:
    rate-per-day: 5.0           # ₹5 per day
    grace-period-days: 1        # 1 day grace period
    max-fine-amount: 500.0      # Maximum fine ₹500
  book:
    max-issue-days: 14          # 14 days borrowing period
    max-renewals: 2             # Maximum 2 renewals
    max-books-per-user: 5       # Maximum 5 books per user
```

## 🔒 Security Features

- **JWT Authentication** with configurable expiration
- **Role-based access control** (RBAC)
- **Password encryption** using BCrypt
- **CORS configuration** for frontend integration
- **Input validation** and sanitization
- **SQL injection prevention** through JPA
- **XSS protection** through proper encoding

## 📊 Database Schema

### Core Entities
- **User**: Student/Librarian/Admin information
- **Book**: Book catalog with availability tracking
- **BookIssue**: Book borrowing records
- **Fine**: Fine management and payment tracking
- **BookRequest**: Book reservation requests
- **Notification**: User notification system

### Key Relationships
- User → BookIssue (One-to-Many)
- Book → BookIssue (One-to-Many)
- BookIssue → Fine (One-to-One)
- User → BookRequest (One-to-Many)
- User → Notification (One-to-Many)

## 🧪 Testing

Run tests with:
```bash
mvn test
```

## 📈 Performance Features

- **Database indexing** on frequently queried fields
- **Pagination support** for large datasets
- **Lazy loading** for entity relationships
- **Connection pooling** for database optimization
- **Caching** for frequently accessed data

## 🔧 Development Tools

- **Hot reload** with Spring Boot DevTools
- **Database console** for development (H2)
- **API documentation** with Swagger
- **Logging** with configurable levels
- **Health checks** and monitoring endpoints

## 🚀 Deployment

### Production Deployment
1. **Update application.yml** for production database
2. **Build the application**
   ```bash
   mvn clean package
   ```
3. **Run the JAR file**
   ```bash
   java -jar target/smart-library-management-1.0.0.jar
   ```

### Docker Deployment
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/smart-library-management-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

---

**Built with ❤️ for educational institutions to modernize their library management systems.**