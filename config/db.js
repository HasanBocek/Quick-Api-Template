const mongoose = require('mongoose');

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('Connected to MongoDB');

        mongoose.connection.on('disconnected', () => {
            console.log('Disconnected from MongoDB');
            reconnectToMongoDB();
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
            reconnectToMongoDB();
        });
    } catch (err) {
        console.error('MongoDB connection error:', err);

        setTimeout(reconnectToMongoDB, 500);
    }
};

const reconnectToMongoDB = () => {
    console.log('Attempting to reconnect to MongoDB...');
    
    connectToMongoDB().catch((err) =>
        console.error('Reconnect failed. Will retry:', err)
    );
};

connectToMongoDB();