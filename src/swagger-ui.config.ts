import fs from 'fs';
import path from 'path';
import {
    absolutePath as getSwaggerPath,
    // @ts-expect-error TS is unable to find this file but it exists after compiling
} from 'swagger-ui-dist';
import swaggerAutogen from 'swagger-autogen';

export async function getSwaggerUIIndexHTML() {
    const swaggerUIRoot = getSwaggerPath();
    const outputFile = './assets/swagger-output.json';
    const routes = [
        process.env.NODE_ENV === 'production' ? './routes/api/index.js' : './routes/api/index.ts',
    ];
    const doc = {
        info: {
            title: 'Perspective Challenge API',
            description: 'Work Challenge API Documentation',
        },
        host:
            process.env.NODE_ENV === 'production'
                ? process.env.API_HOST
                : `http://localhost:${process.env.PORT || 3000}`,
        schemes: ['http', 'https'],
        components: {
            parameters: {
                created: {
                    in: 'query',
                    description: 'Sort by created_at date (asc or desc)',
                    '@enum': ['arc', 'desc'],
                },
            },
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                },
            },
            schemas: {
                user: {
                    $id: 'f54dikmf-42f0-4692-9647-2ea3239dk1f81',
                    $email: 'alex+test@netzok.net',
                    name: 'John Doe',
                    created_at: '2025-06-02T17:21:36.074Z',
                },
            },
        },
    };

    const oaiSpec = await swaggerAutogen({
        openapi: '3.0.0',
        writeOutputFile: false,
        autoHeaders: true,
        autoQuery: true,
        autoBody: true,
    })(outputFile, routes, doc);

    return fs
        .readFileSync(path.join(swaggerUIRoot, 'index.html'))
        .toString('utf8')
        .replace('./favicon-16x16.png', '/swagger-assets/favicon-16x16.png')
        .replace('./favicon-32x32.png', '/swagger-assets/favicon-32x32.png')
        .replace('./swagger-ui.css', '/swagger-assets/swagger-ui.css')
        .replace('index.css', '/swagger-assets/index.css')
        .replace('./swagger-ui-bundle.js', '/swagger-assets/swagger-ui-bundle.js')
        .replace(
            './swagger-ui-standalone-preset.js',
            '/swagger-assets/swagger-ui-standalone-preset.js',
        )
        .replace(
            '<script src="./swagger-initializer.js" charset="UTF-8"> </script>',
            `<script charset="UTF-8">
        window.onload = function() {
          //<editor-fold desc="Changeable Configuration Block">

          // the following lines will be replaced by docker/configurator, when it runs in a docker-container
          window.ui = SwaggerUIBundle({
            dom_id: '#swagger-ui',
            spec: ${JSON.stringify(oaiSpec && oaiSpec.data)},
            deepLinking: true,
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],
            plugins: [
              SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: "StandaloneLayout"
          });

          //</editor-fold>
        };
    </script>`,
        );
}
