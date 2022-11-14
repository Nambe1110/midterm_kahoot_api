
import authRoutes from './auth.routes.js';

const route = (app) => {
    app.get('/', (req, res) => {
        res.status(200).send({
            status: "success",
            data: {
                message: "API is working. Server is running on port 8080"
            }
        });
    });

    app.use('/api/auth', authRoutes);

    app.use((err, req, res, next) => {
        res.status(err.statusCode || 500).send({
            status: "error",
            message: err.message
        });
        next();
    });
    
  
}

export default route