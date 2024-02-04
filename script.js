document.addEventListener("DOMContentLoaded", function () {
  // Fetching IP address
  //   let userTime;
  const moreInfoContainer = document.getElementById("more-info-container");

  fetch("https://ipinfo.io/json?token=ba22e5d40c160c")
    .then((response) => response.json())
    .then((data) => {
      console.log("IP ADDRESS", data);
      const ipAddress = data.ip;
      const ipAddressElement = document.querySelector("h3");
      ipAddressElement.textContent = `Your Current IP Address is : ${ipAddress}`;

      //details section
      const latEle = document.getElementById("lat");
      const cityEle = document.getElementById("city");
      const orgEle = document.getElementById("org");
      const longEle = document.getElementById("long");
      const regionEle = document.getElementById("region");
      const hostEle = document.getElementById("hostname");

      cityEle.innerHTML = `<span class="span-ele">City<span>: ${data.city}`;
      orgEle.innerHTML = `<span class="span-ele">Organization<span>: ${data.org}`;
      regionEle.innerHTML = `<span class="span-ele">Region<span>: ${data.region}`;
      hostEle.innerHTML = `<span class="span-ele">Hostname<span>: ${data.hostname}`;

      //more info section
      moreInfoContainer.innerHTML = `
      <h5>Time Zone:  ${data.timezone}</h5>
      <h5>Pincode:  ${data.postal}</h5>


      `;

      const locationButton = document.getElementById("getLocationBtn");

      locationButton.addEventListener("click", function () {
        const ipAddressEle = document.querySelector("h4");

        ipAddressEle.textContent = `Your Current IP Address is : ${ipAddress}`;

        // Getting information from the IPAPI API using the user's IP
        fetch(`https://ipapi.co/${ipAddress}/json/`)
          .then((response) => response.json())
          .then((apiData) => {
            //latitude and longitude
            const { latitude, longitude, timezone, postal } = apiData;
            const mapSection = document.getElementById("map-section");
            const mapIframe = document.getElementById("mapIframe");
            const searchBox = document.getElementById("searchBox");
            const leftSection = document.getElementById("left-section");
            const rightSection = document.getElementById("right-section");

            //setting long and lat

            latEle.innerHTML = `<span class="span-ele">Lat<span>: ${latitude}`;
            longEle.innerHTML = `<span class="span-ele">Long<span>: ${longitude}`;

            leftSection.style.display = "none";
            rightSection.style.display = "none";
            mapSection.style.display = "block";
            mapIframe.style.display = "block";
            searchBox.style.display = "block";
            mapIframe.src = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;

            //user time
            const userTime = new Date().toLocaleString("en-US", {
              timeZone: timezone,
            });
            console.log("User Time:", userTime);

            let usertimeEle = document.createElement("h5");

            usertimeEle.innerHTML = `
            <h5>Date And Time: ${userTime}</h5>


            `;
            moreInfoContainer.appendChild(usertimeEle);

            // Getting post offices in the user's area based on pincode
            fetch(`https://api.postalpincode.in/pincode/${postal}`)
              .then((response) => response.json())
              .then((postalData) => {
                // Displaying post offices
                console.log("POSTAL DATA", postalData);
                displayPostOffices(postalData);
              })
              .catch((error) =>
                console.error("Error fetching post offices:", error)
              );
          })
          .catch((error) => console.error("Error fetching IPAPI data:", error));
      });
    })
    .catch((error) => console.error("Error fetching IP address:", error));

  const searchBox = document.getElementById("searchBox");
  searchBox.addEventListener("input", function () {
    filterPostOffices(searchBox.value.toLowerCase());
  });

  // filtering post offices based on the user search
  function filterPostOffices(searchTerm) {
    const postOfficeList = document.getElementById("postOfficeList");
    const postOfficeItems = postOfficeList.getElementsByTagName("li");

    for (let i = 0; i < postOfficeItems.length; i++) {
      const postOfficeText = postOfficeItems[i].textContent.toLowerCase();
      if (postOfficeText.includes(searchTerm)) {
        postOfficeItems[i].style.display = "";
      } else {
        postOfficeItems[i].style.display = "none";
      }
    }
  }

  //displaying post offices
  function displayPostOffices(postalData) {
    // let postOfficeCountElement = document.getElementById("postOfficeCount");
    let postOfficesCountEle = document.createElement("h5");

    const postOfficeList = document.getElementById("postOfficeList");

    postOfficeList.innerHTML = "";

    if (postalData[0].Status === "Success") {
      const postOffices = postalData[0].PostOffice;
      console.log("POST OFFICES", postOffices.length);
      let count = postOffices.length;
      console.log(count);
      postOfficesCountEle.textContent = `Message: Number of pincode(s) found:${count}`;
      moreInfoContainer.appendChild(postOfficesCountEle);

      // Creating list items for each post office
      postOffices.forEach((postOffice) => {
        const listItem = document.createElement("li");
        listItem.className = "list-item";
        listItem.innerHTML = `
        <h4 class="list-item-heading">Name: ${postOffice.Name}</h4>
        <h4 class="list-item-heading">Branch Type: ${postOffice.BranchType}</h4>
        <h4 class="list-item-heading">Delivery Status: ${postOffice.DeliveryStatus}</h4>
        <h4 class="list-item-heading">District: ${postOffice.District}</h4>
        <h4 class="list-item-heading">Division: ${postOffice.Division}</h4>



        `;
        postOfficeList.appendChild(listItem);
      });
    } else {
      postOfficeList.textContent = "No post offices found.";
    }
  }
});

//creating function to get lon and lat

/*function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    document.getElementById('coordinates').innerText = `Latitude: ${latitude}, Longitude: ${longitude}`;
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}
*/
