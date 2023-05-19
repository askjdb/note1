function compareObjects(obj1, obj2) {
    const result = {};
  
    function traverse(o1, o2, path) {
      for (const prop in o1) {
        if (o1.hasOwnProperty(prop)) {
          const val1 = o1[prop];
          const val2 = o2[prop];
  
          if (typeof val1 === 'object' && typeof val2 === 'object') {
            traverse(val1, val2, path.concat(prop));
          } else if (val1 !== val2) {
            result[path.concat(prop).join('.')] = {
              oldValue: val1,
              newValue: val2
            };
          }
        }
      }
  
      for (const prop in o2) {
        if (o2.hasOwnProperty(prop) && !o1.hasOwnProperty(prop)) {
          result[path.concat(prop).join('.')] = {
            oldValue: undefined,
            newValue: o2[prop]
          };
        }
      }
    }
  
    traverse(obj1, obj2, []);
  
    return result;
  }
  