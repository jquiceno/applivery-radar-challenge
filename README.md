# Radar Target Decision System

A Node.js application that implements a radar target decision system using Domain-Driven Design (DDD) architecture. The system processes scan data and applies various protocols to determine optimal targeting decisions.

## Project Structure

The project follows a DDD-based architecture with the following structure:

```
src/
├── domain/           # Domain layer: Core business logic
│   ├── entities/     # Domain entities
│   ├── value-objects/# Value objects
│   ├── enums/       # Domain enumerations
│   ├── interfaces/  # Domain interfaces
│   └── factories/   # Domain factories
├── application/     # Application layer: Use cases and DTOs
│   ├── use-cases/   # Application use cases
│   └── dtos/        # Data Transfer Objects
└── infrastructure/  # Infrastructure layer: External concerns
    ├── controllers/ # HTTP controllers
    ├── routes/      # API routes
    ├── schemas/     # Database schemas
    ├── middleware/  # Express middleware
    └── repositories/# Data persistence implementations
```

## Architecture Overview

### Domain Layer

The core of the application where all the business logic resides. This layer is completely independent of external concerns and contains:

- **Entities**: Core business objects (e.g., `TargetDecision`)
- **Value Objects**: Immutable objects that describe domain concepts (e.g., `Coordinates`, `Enemy`, `ScanPoint`)
- **Enums**: Type definitions for domain concepts (e.g., `ProtocolType`, `EnemyType`)
- **Interfaces**: Contracts for repositories and services
- **Factories**: Creation of complex domain objects

### Application Layer

Orchestrates the flow of data and directs it to and from the domain layer:

- **Use Cases**: Implementation of business operations (e.g., `DecideTargetUseCase`, `GetTargetDecisionByIdUseCase`)
- **DTOs**: Data Transfer Objects for input/output data transformation

### Infrastructure Layer

Provides implementations for external concerns:

- **Controllers**: HTTP request handlers
- **Routes**: API endpoint definitions
- **Repositories**: Data persistence implementations (MongoDB)
- **Schemas**: Database schemas (Mongoose)
- **Middleware**: Express middleware for request processing

## Key Features

- Protocol-based decision making
- MongoDB persistence
- RESTful API endpoints
- Modular and maintainable architecture
- Clear separation of concerns

## Protocol Types

The system supports various protocols for target decision making:

- `CLOSEST_ENEMIES`: Prioritizes nearest targets
- `AVOID_CROSSFIRE`: Prevents friendly fire situations
- `AVOID_MECH`: Avoids mechanical unit engagements
- And more...

## Data Models

### Target Decision

The core entity that represents a targeting decision:

```typescript
class TargetDecision {
  protocols: ProtocolType[]
  scan: ScanPoint[]
  target: Coordinates
  id: string
  createdAt: Date
}
```

### Scan Point

Represents a point in the scan with enemy and ally information:

```typescript
class ScanPoint {
  coordinates: Coordinates
  enemies: Enemy
  allies: number
}
```

## Testing

The project includes comprehensive unit tests for all layers:

- Domain logic tests
- Use case tests
- Repository tests
- Integration tests

Tests are written using Jest and follow the AAA (Arrange-Act-Assert) pattern.

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up MongoDB connection
4. Run the tests:
   ```bash
   npm test
   ```
5. Start the application:
   ```bash
   npm start
   ```

## API Endpoints

- `POST /radar`: Submit scan data for target decision
- `GET /decisions`: Get all target decisions
- `GET /decisions/:id`: Get a specific target decision
- `DELETE /decisions/:id`: Delete a target decision

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 