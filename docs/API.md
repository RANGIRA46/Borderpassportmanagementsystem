# API Documentation Reference

See the following resources for full API documentation:

- **[OpenAPI 3.0 Specification](./api/openapi.yaml)** — machine-readable schema for all endpoints, request/response models, and security definitions.
- **[Endpoint Reference](./api/endpoints.md)** — human-readable quick-reference table with curl examples.

## Swagger UI

To explore the API interactively, open the OpenAPI specification in any Swagger UI tool:

```bash
# Using npx (no install needed)
npx @redocly/cli preview-docs docs/api/openapi.yaml

# Or open https://editor.swagger.io and paste the contents of openapi.yaml
```

## Authentication

All protected endpoints require a Supabase JWT token:

```
Authorization: Bearer <your-supabase-jwt>
```

Obtain a token by signing in via [Supabase Auth](https://supabase.com/docs/guides/auth).
