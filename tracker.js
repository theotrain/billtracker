window.addEventListener("DOMContentLoaded", (event) => {
  let allBillsArray = [];
  let showThisMany = 5;
  const addThisMany = 1;
  const insertHTML = () => {};

  const start = () => {
    insertHTML();

    getSheetData({
      sheetName: "bills",
      query: "SELECT * WHERE E > date '2020-07-9' ORDER BY E DESC",
      callback: getBillsResponse,
    });
  };

  const getBillsResponse = (bills) => {
    //bill is array of objects
    allBillsArray = bills;
    displayBills(allBillsArray);
    console.log("dolla dolla bills: ", bills);
  };

  const stringToList = (str) => {
    return (
      "<ul>" +
      str
        .split("\n\n")
        .map((item) => `<li>${item}</li>`)
        .join("") +
      "</ul>"
    );
  };

  const stringToHTML = (str) => {
    let paragraphs = str
      .split("\n\n")
      .map((item) => {
        return item.trim().length === 0 ? "" : `<p>${item}</p>`;
      })
      .join("");
    const regex = /[\r\n]/g;
    // console.log(p.replace(regex, 'ferret'));
    return paragraphs.replace(regex, "<br />");
    // return paragraphs;
  };

  const billTemplate = (bill) => {
    const quantity = bill["Cosponsor Quantity"];
    const introduced = bill["Introduced"];
    const lastAction = bill["Last Action"];
    const link = bill["Link"];
    const name = bill["Name"];
    const number = bill["Number"];
    const sponsor = bill["Sponsor"];
    const summary = stringToHTML(bill["Summary"]);
    const analysis = stringToList(bill["Analysis"]);
    const democrat = bill["Democrat"];
    const republican = bill["Republican"];
    const independent = bill["Independent"];
    const bipartisan = bill["Bipartisan"];
    const boldChanges = bill["Bold Changes"];
    const practical = bill["Practical Infrastructure"];
    const omnibus = bill["Omnibus Bill"];
    const newIncentive = bill["New Incentive"];

    return `<div class="bill">
        <div class="bill-header">
          <a href="${link}" target="_blank" class="bill-number">${number}</a>
          <div class="title">${name}</div>

          <div class="bill-label">Lead Sponsor</div>
          <div class="sponsor">${sponsor}</div>
          <div class="cosponsor-quantity">/ ${quantity} Cosponsors</div>
        </div>
        <div class="bill-summary">
          <div class="bill-label">Summary</div>
          <p>
          ${summary}
          </p>
          <div class="bill-section-spacer"></div>
          <div class="bill-label">Analysis</div>
          <p>
          ${analysis}
          </p>
        </div>
        <button type="button" class="bill-showhide">
          <span class="showhide-text">SHOW DETAILS</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="10.958" height="6.893" viewBox="0 0 10.958 6.893">
            <path id="Path_29" data-name="Path 29" d="M321.357,2054.082l4.772,4.772,4.772-4.772"
              transform="translate(-320.65 -2053.375)" fill="none" stroke="#fff" stroke-width="2"></path>
          </svg>
        </button>
    </div>`;
  };

  const displayBills = (bills = allBillsArray) => {
    // showThisMany
    const billsElement = document.querySelector("#bills");
    if (bills.length == 0) {
      billsElement.innerHTML = "<h3>There are no bills to display.<h3>";
      return;
    }
    // console.log("displayBills: ", bills);
    // console.log(billTemplate(bills[0]));
    if (anyFiltersChecked()) {
      showBills = bills.map((bill) => billTemplate(bill));
      billsElement.innerHTML = showBills.join("");
    } else {
      // only limit display quantity and show more button when all filters off
      let showBills = bills.slice(0, showThisMany);
      showBills = showBills.map((bill) => billTemplate(bill));
      // console.log(allBills.join(""));
      let moreButtonHTML =
        showBills.length < allBillsArray.length
          ? "<div id='more'><button>Show More</button></div>"
          : "";
      billsElement.innerHTML = showBills.join("") + moreButtonHTML;
    }
    addShowHideClickEvents();
    initMoreButton();
  };

  const addShowHideClickEvents = () => {
    const tracker = document.querySelector("#tracker");
    const legislators = document.querySelector("#legislators");
    const openLegislators = document.querySelector("#openLegislators");
    const openBillTracker = document.querySelector("#openBillTracker");

    openBillTracker.addEventListener("click", (e) => {
      openBillTracker.classList.add("active");
      openLegislators.classList.remove("active");
      tracker.style.display = "flex";
      legislators.style.display = "none";
    });
    openLegislators.addEventListener("click", () => {
      openBillTracker.classList.remove("active");
      openLegislators.classList.add("active");
      tracker.style.display = "none";
      legislators.style.display = "flex";
    });

    function openCity(evt, cityName) {
      // Declare all variables
      var i, tabcontent, tablinks;

      // Get all elements with class="tabcontent" and hide them
      tabcontent = document.getElementsByClassName("tabcontent");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }

      // Get all elements with class="tablinks" and remove the class "active"
      tablinks = document.getElementsByClassName("tablinks");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
      }

      // Show the current tab, and add an "active" class to the button that opened the tab
      document.getElementById(cityName).style.display = "block";
      evt.currentTarget.className += " active";
    }

    const billShowHideButtons = document.querySelectorAll(".bill-showhide");
    for (let i = 0; i < billShowHideButtons.length; i++) {
      billShowHideButtons[i].addEventListener("click", function () {
        let textElement = this.querySelector(".showhide-text");
        this.classList.toggle("active");
        var content = $(this.previousElementSibling);
        // if (content.style.display === "block") {
        if (this.classList.contains("active")) {
          // content.style.marginTop = "16px";
          textElement.innerHTML = "HIDE DETAILS";
          // content.style.display = "block";
          // content.style.maxHeight = "100vh";
          content.slideDown(250);
        } else {
          // content.style.marginTop = "0px";
          textElement.innerHTML = "SHOW DETAILS";
          // content.style.display = "none";
          // content.style.maxHeight = "0px";
          content.slideUp(250);
        }
      });
    }
  };

  // const tagNames = [
  //   { id: 'democrat', title: 'Democrat'},
  //   { id: 'democrat', title: 'Republican'},
  //   { id: 'Independent', title: 'Independent'},
  //   { id: 'Bipartisan', title: 'Bipartisan'},
  //   { id: 'democrat', title: 'Practical Infrastructure'},
  //   { id: 'democrat', title: 'Omnibus Bill'},
  //   { id: 'democrat', title: 'New Incentive'},
  // ]

  const filterTags = [
    {
      title: "CHAMBER",
      tags: ["House", "Senate", "Bicameral"],
    },
    {
      title: "PARTY SUPPORT",
      tags: ["Democrat", "Republican", "Independent", "Bipartisan"],
    },
    {
      title: "CONGRESS",
      tags: ["116th", "117th", "118th"],
    },
    {
      title: "ISSUE AREAS",
      tags: [
        "Soil Health",
        "Livestock/Grazing",
        "Local/Regional Food Systems",
        "Ag Infrastructure",
        "Forestry",
        "Wildfire",
        "Row Crops",
        "Finance",
        "Taxes",
        "Incentives",
        "Regional Infrastructure",
        "Research",
        "Crop Insurance",
        "Marker Bill",
        "Regulation",
        "Removing Barriers",
      ],
    },
    {
      title: "BILL TYPE",
      tags: ["Omnibus Package", "Resolution"],
    },
    {
      title: "IMPORTANCE TO SOIL HEALTH",
      tags: ["Core", "Secondary"],
    },
  ];

  const initMoreButton = () => {
    const moreButton = document.querySelector("#more button");
    if (moreButton) {
      console.log("more button: ", moreButton);
      moreButton.addEventListener("click", (e) => moreButtonAction());
    }
  };

  const moreButtonAction = (e) => {
    showThisMany += addThisMany;
    console.log("more ", showThisMany);
    displayBills();
  };

  const initFilters = () => {
    const filterElement = document.querySelector("#filters");
    let filterHTML = "";
    const tagsHTML = filterTags.forEach((tagObject) => {
      filterHTML += `<div class="filter-section">`;
      filterHTML += tagTitleTemplate(tagObject.title);
      filterHTML += tagObject.tags
        .map((tagName) => {
          return tagCheckboxTemplate(tagName);
        })
        .join("");
      filterHTML += `</div>`;
    });
    filterElement.innerHTML = filterHTML;

    // console.log(tagName);
    // console.log(tagsHTML);
    setFilterActions();
  };

  const setFilterActions = () => {
    const checkBoxes = document.querySelectorAll("#filters .tagCheckbox");
    checkBoxes.forEach((checkbox) =>
      checkbox.addEventListener("change", (e) => filterBills())
    );
  };

  const filterBills = () => {
    // console.log("filter bills");
    const filters = getCheckedFilters();
    console.log(filters);
    console.log(allBillsArray);
    if (filters.length === 0) {
      displayBills();
      return;
    }
    // create array of bill objects from allBillsArray
    // and pass to displayBills(bills)
    displayBills(
      allBillsArray.filter((bill) => {
        return filters.some((filterName) => {
          // console.log(filterName);
          // console.log(bill[filterName]);
          return bill[filterName];
        });
      })
    );
  };

  const anyFiltersChecked = () => {
    getCheckedFilters().length;
  };

  const getCheckedFilters = () => {
    const checkBoxes = document.querySelectorAll("#filters .tagCheckbox");
    filterNames = [];
    checkBoxes.forEach((checkBox) => {
      if (checkBox.checked) filterNames.push(checkBox.name);
    });
    // console.log(filterNames)
    return filterNames;
  };

  const tagCheckboxTemplate = (tagName) => {
    return `
      <label class="filter-check">
      <input class="tagCheckbox" type="checkbox" name="${tagName}" />
      <span>${tagName}</span>
      </label>`;
  };

  const tagTitleTemplate = (tagTitle) => {
    return `<div class="filter-section-title">${tagTitle}</div>`;
  };

  initFilters();
  start();
  // addShowHideClickEvents();
});
