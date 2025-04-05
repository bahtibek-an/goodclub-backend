import { serve, setup } from 'swagger-ui-express';
import YAML from "yamljs";
import path from "path";

const swaggerSpec = YAML.load(path.join("docs", "swagger.yaml"));

export { serve, swaggerSpec, setup };
