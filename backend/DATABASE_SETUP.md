# MySQL Database Setup

## Prerequisites
- MySQL Server 8.0+ installed
- MySQL running on localhost:3306

## Quick Setup

### Option 1: Using Root User (Recommended for development)
Update `application.yml`:
```yaml
spring:
  datasource:
    username: root
    password: your_mysql_root_password
```

### Option 2: Create Dedicated User
1. Run the setup script:
```bash
mysql -u root -p < database/setup.sql
```

2. Update `application.yml`:
```yaml
spring:
  datasource:
    username: library_user
    password: library_password
```

## Environment Variables (Production)
```bash
export DB_USERNAME=your_username
export DB_PASSWORD=your_password
```

## Run Application
```bash
mvn spring-boot:run
```

## Development with H2
```bash
mvn spring-boot:run -Dspring.profiles.active=dev
```