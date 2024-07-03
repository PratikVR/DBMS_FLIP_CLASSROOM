const socket_io = io();
const form = document.querySelector("#Query-This");
const formBtn = document.querySelector("#btn");
const result = document.querySelector("#result");
console.log(formBtn);
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let query = document.querySelector("#Query"); //get the value of
  console.log(query.value);
  socket_io.emit("query", query.value);
});

socket_io.on("result", (data) => {
    console.log(data[0]?.affectedRows);
    console.dir(data)
    if(data.error){
        result.innerHTML = `${data.error} details: ${JSON.stringify(data.details)}`;
    }
    else if(data[0].affectedRows==1){
        result.innerHTML = `details: ${JSON.stringify(data[0])}`;
    }
    else if (typeof data[0] === "object") {
      const queryResult = data[0];
      const firstRow = queryResult[0];
      const columnNames = Object.keys(firstRow);
      
      // Construct the table header
      let tableHTML = "<table><thead><tr>";
      columnNames.forEach(name => {
        tableHTML += `<th>${name}</th>`;
      });
      tableHTML += "</tr></thead><tbody>";
  
      // Construct the table body
      queryResult.forEach((row) => {
        tableHTML += "<tr>";
        columnNames.forEach(name => {
          tableHTML += `<td>${row[name]}</td>`;
        });
        tableHTML += "</tr>";
      });
  
      // Close the table
      tableHTML += "</tbody></table>";
  
      // Update the DOM element
      result.innerHTML = tableHTML;
    }
  });