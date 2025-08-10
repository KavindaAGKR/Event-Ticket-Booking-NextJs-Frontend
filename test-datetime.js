// Quick test for datetime formatting
const formatDateTimeForBackend = (dateTimeString) => {
  console.log("Original datetime string:", dateTimeString);
  
  if (!dateTimeString) {
    throw new Error("DateTime string is required");
  }

  if (dateTimeString.includes("Z") || dateTimeString.match(/[+-]\d{2}:\d{2}$/)) {
    console.log("Already in ISO format:", dateTimeString);
    return dateTimeString;
  }

  if (dateTimeString.includes("T")) {
    let formatted;
    
    if (dateTimeString.match(/T\d{2}:\d{2}:\d{2}/)) {
      if (dateTimeString.match(/T\d{2}:\d{2}:\d{2}$/)) {
        formatted = `${dateTimeString}.000Z`;
      } else if (dateTimeString.match(/T\d{2}:\d{2}:\d{2}\.\d{3}$/)) {
        formatted = `${dateTimeString}Z`;
      } else {
        formatted = dateTimeString;
      }
    } else {
      formatted = `${dateTimeString}:00.000Z`;
    }
    
    console.log("Formatted datetime:", formatted);
    return formatted;
  }

  const date = new Date(dateTimeString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateTimeString}`);
  }

  const isoString = date.toISOString();
  console.log("Fallback ISO string:", isoString);
  return isoString;
};

// Test with the problematic input
const testInput = "2025-08-22T17:07";
console.log("Testing:", testInput);
const result = formatDateTimeForBackend(testInput);
console.log("Result:", result);

// Test with another format
const testInput2 = "2025-08-22T17:07:00";
console.log("Testing:", testInput2);
const result2 = formatDateTimeForBackend(testInput2);
console.log("Result:", result2);
