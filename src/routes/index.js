
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import groupRoutes from './group.routes.js';
import presentationRoutes from './presentation.routes.js';
import notificationRoutes from './notification.routes.js';
import questionRoutes from './question.routes.js';
import chatRoutes from './chat.routes.js';

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
    app.use('/api/group', groupRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/presentation', presentationRoutes);
    app.use('/api/notification', notificationRoutes);
    app.use('/api/question', questionRoutes);
    app.use('/api/chat', chatRoutes);

    app.use((err, req, res, next) => {
        res.status(err.statusCode || 500).send({
            status: "error",
            message: err.message
        });
        next();
    });
    
  
}

export default route