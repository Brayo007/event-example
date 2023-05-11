import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      slug: { type: String, required: true, unique: true },
      category: { type: String, required: true },
      //image: { type: String, required: true },
      simages: [
        { type: String, required: false },
      ],
      description: { type: String, required: true },
      
      location: { type: String, required: false },
      featured: { type: Boolean, required: false, default: false },
      
  
    },
    {
      timestamps: true,
    }
  );
  
  const Event =
    mongoose.models.Event || mongoose.model('Event', eventSchema);
  export default Event;