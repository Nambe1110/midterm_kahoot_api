
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import groupRoutes from './group.routes.js';
import passport from 'passport';

const route = (app) => {
    app.get('/', (req, res) => {
        res.status(200).send({
            status: "success",
            data: {
                message: "API is working. Server is running on port 8080"
            }
        });
    });

    // Google sign in
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile','email'] }))
    app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/error' }),
        (req, res) => {
            res.redirect('/api/user/current_user');
        }
      )
    app.get('/api/user/current_user', (req, res) => {
       res.send(req.user);
    })

    app.use('/api/auth', authRoutes);
    app.use('/api/group', groupRoutes);
    app.use('/api/user', userRoutes);

    app.use((err, req, res, next) => {
        res.status(err.statusCode || 500).send({
            status: "error",
            message: err.message
        });
        next();
    });
    
  
}

export default route