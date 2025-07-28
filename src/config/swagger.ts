import swaggerJSDoc, { Options } from 'swagger-jsdoc'

/**
 * @file OpenAPI 3.1 Specification for Tiktok Clone 2025 API
 * @author TaplamIT <ndtrg281@gmail.com>
 */

const apiInfo = {
    openapi: '3.1.0',
    info: {
        title: 'Tiktok Clone 2025 - API Documentation',
        version: '1.0.0',
        description: `
**Welcome to the Tiktok Clone 2025 API.** This platform is a short-form video sharing service inspired by TikTok, built following the **OpenAPI 3.1** specification with a **Design-First** approach.

### Core Features
-   **User Authentication**: Sign-up, sign-in, and email verification.
-   **Profile Management**: Follow, unfollow, and block users.
-   **Video Interactions**: Curated feeds, likes, comments, and shares.
-   **Real-time Chat**: Private messaging system using WebSockets.
-   **Intelligent Discovery**: Hashtag-based content suggestions and advanced search.
        `,
        contact: {
            name: 'API Support Team',
            url: 'https://support.tiktok-clone-2025.io',
            email: 'support@tiktok-clone-2025.io'
        },
        license: {
            name: 'Apache 2.0',
            url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
        }
    }
}

const servers = [
    {
        url: 'http://localhost:3000/api/v1',
        description: 'Local Development Server'
    },
    {
        url: 'https://api.taplamit.tech/api/v1',
        description: 'Production Server'
    }
]

const components = {
    securitySchemes: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Enter your JWT in the format: Bearer {token}'
        }
    }
}

const swaggerOptions: Options = {
    definition: {
        ...apiInfo,
        servers: servers,
        components: components,
        security: [
            {
                bearerAuth: []
            }
        ],
        externalDocs: {
            description: 'Official OpenAPI Specification',
            url: 'https://spec.openapis.org/oas/v3.1.0'
        }
    },
    apis: ['./src/docs/swagger/*.swagger.yaml']
}

const openApiSpecification = swaggerJSDoc(swaggerOptions)

export default openApiSpecification
