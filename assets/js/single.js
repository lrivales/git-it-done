var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

var getRepoOwnerAndName = function() {
    if (document.location.search) {
        var queryString = document.location.search;
        var splitQueryString = queryString.split("&");
        var sliceOwnerString = splitQueryString[0].slice(1);
        var repoOwner = sliceOwnerString.split("=")[1];
        var repoName = splitQueryString[1].split("=")[1];
        repoNameEl.textContent = repoName;
        getRepoIssues(repoOwner, repoName);
    } else {
        document.location.replace("./index.html");
    }
}; 

var getRepoIssues = function(owner,repo) {
    var apiUrl = "https://api.github.com/repos/"+owner+"/"+repo+"/issues?direction=asc";
    
    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                // pass response data to DOM function
                displayIssues(data);

                // check if api has paginated issues
                if (response.headers.get("Link")) {
                    displayWarning(owner, repo)
                }
            });
        } else {
            document.location.replace("./index.html");
        }
    });
};

var displayIssues = function(issues) {
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues.";
        return;
    };

    for (var i = 0; i < issues.length; i++) {
        // create a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        // create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // create a type element
        var typeEl = document.createElement("span");

        // check if issue is an actual issue or a pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull Request)";
        } else {
            typeEl.textContent = "(Issue)"
        }
        // append to container
        issueEl.appendChild(titleEl);
        issueEl.appendChild(typeEl);
        issueContainerEl.appendChild(issueEl);
    }
};

var displayWarning = function(owner, repo) {
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";

    var linkEl = document.createElement("a");
    linkEl.textContent = "See more issues on Github.com";
    linkEl.setAttribute("href","https://api.github.com/repos/"+owner+"/"+repo+"/issues");
    linkEl.setAttribute("target","_blank");

    // append to warning container
    limitWarningEl.appendChild(linkEl);
};

getRepoOwnerAndName();