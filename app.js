// This is a big project, app.js is the main page. all other pages are linked to here.
// Manager, Engineer, and Intern are all extensions of of the Employee class in the lib folder.
    // These all define the object of an employee by their role.
// The "const render" refers to the htmlRenderer.js - this file is what generates the HTML using the -
// HTML templates, and combines them with the user input from app.js.
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// This array holds new Employee(name, id, email, var) after they have been generated below.
const ansArr = [];

// This all needs to be wrapped in a function, so that it can be recalled if you want to add more than one employee.
// At the end of the function an option is given to add another employee, start is called so another can be added. 
 function start() {
    
    // inquirer is used to prompt the CLI for input
    inquirer.prompt([
        {
            type: "input", 
            name: "name",
            message: "Hello user!!! Nice to see you. What is your name?"
        },
        {
            type: "input",
            name: "id",
            message: "What is your user ID?"
        },
        {
            type: "input",
            name: "email",
            message: "What is your e-mail address?"
        },
        {
            type: "list",
            name: "role",
            message: "What is your role?",
            choices: ["Manager", "Engineer", "Intern"]
        },
        {
            type: "input",
            name: "github",
            message: "What is your github username?",
            when: function (response) {
                return response.role === "Engineer"
            }
        },
        {
            type: "input",
            name: "school",
            message: "What school are you with?",
            when: function (response) {
                return response.role === "Intern"
            }
        },
        {
            type: "input",
            name: "officeNumber",
            message: "what is your office number?",
            when: function (response) {
                return response.role === "Manager"
            }
        }, 
        // This is important because it contains a true or false value that will -
        // eventually allow you to run the start function again.
        {
            type: "confirm",
            name: "again",
            message: "Would you like to add any more team members?",
        }, 
        
    // This function takes the user input from inquirer and turns it into a new employee, to be pushed -
    // to the ansArr. 
    ]).then(function (res) {
        
       switch(res.role){
            case "Manager":
                const man = new Manager(res.name, res.id, res.email, res.officeNumber);
                ansArr.push(man);
                break;
            
            case "Intern":
                const int = new Intern(res.name, res.id, res.email, res.school);
                ansArr.push(int);
                break;

            case "Engineer":
                const eng = new Engineer(res.name, res.id, res.email, res.github);
                ansArr.push(eng);
                break;

            default: 
                console.log("Something went wrong!");
                break;
        };
        
        // This if statement refers to the last inquirer question. If user selects yes to add another -
        // employee, it restarts the inquirer function. 
        if(res.again === true){
            start();
        
        // Wrapping the fs.writeFile in "else" is paramount! if it is not wrapped,
        // it will write the file before adding the new employees. 
        }else{

            // Here we call render - the function that links this page to htmlRenderer.js, and pass our 
            // new employees to it. 
            const html = render(ansArr);
            
            // Then we pass it into our fs.writeFile - outputPath is defined at the top of app.js - 
            // it creates a completed HTML file in the output folder.
            fs.writeFile(outputPath, html, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Wright complete!");
                }
            });
        };
    });
   
};
start();

