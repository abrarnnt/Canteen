const mongoose = require("mongoose");

// Time format validator
const isValidTime = (timeStr) => {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;  // Format HH:mm (24-hour)
  return timeRegex.test(timeStr);
};

const mealTimingSchema = new mongoose.Schema({
  enabled: {
    type: Boolean,
    default: false
  },
  startTime: {
    type: String,
    default: "00:00",
    validate: {
      validator: isValidTime,
      message: "Start time must be in HH:mm format (24-hour)"
    }
  },
  endTime: {
    type: String,
    default: "00:00",
    validate: {
      validator: function(endTime) {
        if (!isValidTime(endTime)) return false;
        
        if (!this.startTime) return true;
        
        // Convert times to minutes for comparison
        const startMinutes = this.startTime.split(':').reduce((acc, time) => (60 * acc) + +time);
        const endMinutes = endTime.split(':').reduce((acc, time) => (60 * acc) + +time);
        
        return endMinutes > startMinutes;
      },
      message: "End time must be in HH:mm format (24-hour) and after start time"
    }
  }
});

const locationSchema = new mongoose.Schema({
  placeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Places',
    required: true
  },
  locationName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  meals: {
    breakfast: mealTimingSchema,
    lunch: mealTimingSchema,
    supper: mealTimingSchema,
    dinner: mealTimingSchema,
    lateSnacks: mealTimingSchema
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // This will add createdAt and updatedAt automatically
});

// Pre-save hook to ensure meal timing validity
locationSchema.pre('save', function(next) {
  const meals = ['breakfast', 'lunch', 'supper', 'dinner', 'lateSnacks'];
  let lastEndTime = "00:00";

  for (const meal of meals) {
    if (this.meals[meal].enabled) {
      // Convert current start time to minutes
      const curStartMinutes = this.meals[meal].startTime.split(':').reduce((acc, time) => (60 * acc) + +time);
      // Convert last end time to minutes
      const lastEndMinutes = lastEndTime.split(':').reduce((acc, time) => (60 * acc) + +time);

      // Ensure meals don't overlap
      if (curStartMinutes < lastEndMinutes) {
        next(new Error(`${meal} start time must be after previous meal's end time`));
        return;
      }
      lastEndTime = this.meals[meal].endTime;
    }
  }
  next();
});

module.exports = mongoose.model("Location", locationSchema);