document.addEventListener("DOMContentLoaded", function() {
    //for basic pages header
    if (document.querySelector(".basic-page") && window.location.href.includes("/search/")) {
        const header = document.querySelector("h1.page-header");
        if (header) {
            header.classList.add("no-margin-top");
        }
    }
    //search bar in business domains
    const style = document.createElement('style');
    style.textContent = `
  .sidemenu-navitems.hidden-by-search {
    display: none !important;
  }
`;
    document.head.appendChild(style);
    const searchBar = document.getElementById("searchbardomains");
    if (searchBar) {
        searchBar.onkeyup = function() {
            const val = this.value.toLowerCase();
            let matchCount = 0;

            document.querySelectorAll('.sidemenu-navitems').forEach(el => {
                const text = el.innerText.toLowerCase();
                const match = text.includes(val);
                if (match) {
                    el.classList.remove('hidden-by-search');
                    matchCount++;
                } else {
                    el.classList.add('hidden-by-search');
                }
            });

            console.log(`🔍 Found ${matchCount} match(es) for: "${val}"`);
        };
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    let searchTerm = urlParams.get("search_api_fulltext");

    // Check if searchTerm is defined
    if (typeof searchTerm !== "undefined" && searchTerm !== null) {
        if (searchTerm.trim() !== "") {
            // Select all elements within the basic-page container
            const allElements = document.querySelectorAll(".basic-page *");

            // Create a regex for the search term to handle both exact and partial matches
            // Create a regular expression pattern to match partial occurrences of the search term
            const regexPattern = "\\b" + searchTerm.split('').join('\\w*') + "\\w*\\b";
            const regexExact = new RegExp(regexPattern, "gi");

            const searchWords = searchTerm.split(" ");
            const wordPatterns = searchWords.map(word => `\\b${word}\\b`).join("|");
            const regexPartial = new RegExp(wordPatterns, "gi");

            // Iterate over each element
            allElements.forEach((element) => {
                // Check if this element contains the search term
                const textContent = element.textContent;
                const matchExact = textContent.match(regexExact);
                const matchPartial = textContent.match(regexPartial);
                if (matchExact) {
                    // Handle exact match
                    const searchTermIndex = textContent.indexOf(matchExact[0]);
                    const startIndex = Math.max(0, searchTermIndex - 300); // Start 300 characters before the search term
                    const endIndex = Math.min(textContent.length, searchTermIndex + searchTerm.length + 300); // End 300 characters after the search term
                    const truncatedText = textContent.substring(startIndex, endIndex);
                    // Replace the element's content with truncated text
                    element.innerHTML = truncatedText.replace(regexExact, "<span class='highlight'>$&</span>");

                    // Get the "about" attribute value from the closest ancestor article tag
                    const article = element.closest("article");
                    if (article) {
                        const aboutValue = article.getAttribute("about");
                        // Create a "Read More" button with a dynamic URL
                        const readMoreButton = document.createElement("a");
                        readMoreButton.href = aboutValue; // Use the "about" attribute value as URL
                        readMoreButton.textContent = "..........Read More";
                        // Append the "Read More" button to the element
                        element.appendChild(readMoreButton);
                    }
                } else if (matchPartial) {
                    // Handle partial match
                    const startIndex = Math.max(0, textContent.indexOf(matchPartial[0]) - 300); // Start 300 characters before the search term
                    const endIndex = Math.min(textContent.length, textContent.indexOf(matchPartial[0]) + searchTerm.length + 300); // End 300 characters after the search term
                    const truncatedText = textContent.substring(startIndex, endIndex);
                    // Replace the element's content with truncated text
                    element.innerHTML = truncatedText.replace(regexPartial, "<span class='highlight'>$&</span>");

                    // Get the "about" attribute value from the closest ancestor article tag
                    const article = element.closest("article");
                    if (article) {
                        const aboutValue = article.getAttribute("about");
                        // Create a "Read More" button with a dynamic URL
                        const readMoreButton = document.createElement("a");
                        readMoreButton.href = aboutValue; // Use the "about" attribute value as URL
                        readMoreButton.textContent = "..........Read More";
                        // Append the "Read More" button to the element
                        element.appendChild(readMoreButton);
                    }
                } else {
                    // Remove the element if it does not contain the search term
                    element.remove();
                }
            });

            // Remove classes from all elements under the basic-page container
            const basicPages = document.querySelectorAll(".basic-page");
            basicPages.forEach((basicPage) => {
                const allElements = basicPage.querySelectorAll("*");
                allElements.forEach((element) => {
                    element.removeAttribute("class");
                });
            });

            // Highlight the search term in the content
            highlight();

            const basicPageDivs = document.querySelectorAll(".basic-page");

            basicPageDivs.forEach((div) => {
                // Check if the basic-page div is empty
                if (div.innerHTML.trim() === '') {
                    // Find the previous sibling, which should be the search-term-result div
                    const searchResult = div.previousElementSibling;
                    if (searchResult && searchResult.id === "search-term-result") {
                        // Make the display of the found search-term-result block
                        searchResult.style.display = "block";

                        const aboutValue = div.closest("article").getAttribute("about");
                        // Create a "Read More" button with a dynamic URL
                        const readMoreButton = document.createElement("a");
                        readMoreButton.href = aboutValue; // Use the "about" attribute value as URL
                        readMoreButton.textContent = "..........Read More";
                        // Append the "Read More" button to the element
                        searchResult.appendChild(readMoreButton);
                    }
                }
            });



        } else {
            // Select all elements with the id "search-term-result"
            const searchTermResults = document.querySelectorAll("#search-term-result");

            // Loop through each element
            searchTermResults.forEach((searchTermResult) => {
                // Make the display of the current searchTermResult block
                searchTermResult.style.display = "block";
                const closestArticle = searchTermResult.closest("article");

                if (closestArticle) {
                    const aboutValue = closestArticle.getAttribute("about");
                    // Create a "Read More" button with a dynamic URL
                    const readMoreButton = document.createElement("a");
                    readMoreButton.href = aboutValue; // Use the "about" attribute value as URL
                    readMoreButton.textContent = "..........Read More";
                    // Append the "Read More" button to the element
                    searchTermResult.appendChild(readMoreButton);
                }
            });

            // Remove the .basic-page element if searchTerm is empty
            const basicPages = document.querySelectorAll(".basic-page");
            basicPages.forEach((basicPage) => {
                basicPage.remove();
            });
        }
        // Add styles
        const styleElement = document.createElement("style");
        styleElement.textContent = `
    #page-node-title {
        display: inline-grid;
        padding-bottom: 0%;
    }
    .highlight {
        background-color: yellow;
        font-weight: bold;
    }
`;
        document.head.appendChild(styleElement);
    }

    // Function to highlight the search term in the content
    function highlight() {
        const searchTerm = urlParams.get("search_api_fulltext");
        const searchRegEx = new RegExp(searchTerm, "gi");
        const basicPageContainers = document.querySelectorAll(".basic-page");

        basicPageContainers.forEach((basicPageContainer) => {
            traverseAndHighlight(basicPageContainer, searchRegEx);
        });
    }

    // Function to traverse and highlight text nodes containing the search term
    function traverseAndHighlight(node, searchRegEx) {
        if (node.nodeType === Node.TEXT_NODE) {
            // Check if the node is not a descendant of an anchor element
            if (!node.parentElement.closest("a")) {
                const text = node.textContent;
                const highlightedText = text.replace(
                    searchRegEx,
                    '<span class="highlight">$&</span>'
                );
                const tempElement = document.createElement("div");
                tempElement.innerHTML = highlightedText;

                // Replace the text node with the highlighted version
                while (tempElement.firstChild) {
                    node.parentNode.insertBefore(tempElement.firstChild, node);
                }
                node.parentNode.removeChild(node);
            }
        } else {
            // Recursively traverse child nodes
            for (let i = 0; i < node.childNodes.length; i++) {
                traverseAndHighlight(node.childNodes[i], searchRegEx);
            }
        }
    }

    // Select all elements with class 'basic-page'
    const basicPages = document.querySelectorAll('.basic-page');
    // Loop through each 'basic-page' element
    basicPages.forEach(basicPage => {
        let readMoreCount = 0; // Counter to track the number of 'Read More' links

        // Select all anchor tags within this 'basic-page'
        const anchorTags = basicPage.querySelectorAll('a');
        // console.log(anchorTags);

        // Loop through each anchor tag
        anchorTags.forEach(anchorTag => {
            // Check if the anchor tag contains 'Read More' in its text content
            if (anchorTag.textContent.trim() === "..........Read More") {
                // Increment the counter
                readMoreCount++;

                // If it's not the first 'Read More' link and the counter is greater than 1, remove it
                if (readMoreCount > 1) {
                    anchorTags[0].remove();
                }
            }
        });
    });


    var feedback = window.location.pathname;

    // Check if the path includes 'contact' or 'feedback'
    if (feedback.includes('contact/feedback')) {
        // Get the element with the class 'region-content'
        var regionContentElement = document.querySelector('.region-content');

        // Add the ID 'contact-feedback-form' to the element
        if (regionContentElement) {
            regionContentElement.id = 'contact-feedback-form';
        }

        var headingTarget = document.querySelector('.page-header');
        if (headingTarget) {
            headingTarget.id = 'contact-feedback-heading';
        }


    }


    if (feedback.includes('user/register')) {
        var apicSignupForm = document.querySelector('.apic-user-form');
        apicSignupForm.classList.add('custom-signup');
        const bgImages = `
                <div class="bg-images">
                    <div class="circle-1"></div>
                    <div class="circle-2"></div>
                </div>
            `;
        apicSignupForm.insertAdjacentHTML('afterbegin', bgImages);
    }


    if (feedback.includes('user/login')) {
        var apicSigninForm = document.querySelector('.apic-user-form');
        var forgotPassword = document.querySelector('.apic-user-forgot-password');
        var signupLink = document.querySelector('.apic-user-form-text');

        apicSigninForm.classList.add('custom-signinsec');
        signupLink.style.display = 'none';
        forgotPassword.style.display = 'none';

    }

    /* janet js changes for subscription*/
    if (feedback.includes("/subscription")) {

        let element = document.querySelector(".apicMainContent");
        if (element) {
            element.classList.add("custom-APIproduct");
            element.insertAdjacentHTML("afterbegin", `
                    <div class="bg-images">
                        <p class="pattern"></p>
                        <div class="circle-1"></div>
                        <div class="circle-2"></div>
                    </div>
                `);;
        }
    }

    if (window.location.pathname.includes("/subscription_noplan")) {
        let element = document.querySelector(".apicMainContent");
        if (element) {
            element.classList.add("custom-APIproduct");
            element.insertAdjacentHTML("afterbegin", `
                    <div class="bg-images">
                        <p class="pattern"></p>
                        <div class="circle-1"></div>
                        <div class="circle-2"></div>
                    </div>
                `);;
        }
    }

    /* janet js changes for subscription*/


    if (feedback.endsWith("/product")) {
        var productHeader = document.querySelector('.page-header');
        if (productHeader) {
            productHeader.id = 'pageHeader';
        }

    }



    const pattern = /\/product\/\d+$/; // Matches /product/{id} with numeric ID

    if (pattern.test(feedback)) {
        let element = document.querySelector(".region-content");
        if (element) {
            element.classList.add("custom-ARBproduct");

        }
    }







    if (window.location.pathname.includes('/api')) {
        // Select the first <div> with class 'row'
        var rowDiv = document.querySelector('.row-1');

        // Check if the <div> exists before adding the class
        if (rowDiv) {
            rowDiv.classList.add('custom-articalbox');
        } else {
            console.warn('No element with class "row" found.');
        }
    }
    const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                const regionHighlighted = document.querySelector('.region.region-highlighted');

                // Check if there is no 'div' with class 'alert' inside 'region region-highlighted'
                if (regionHighlighted && regionHighlighted.querySelector('.alert')) {
                    const apicMainContent = document.querySelector('.apicMainContent.container .region.region-highlighted');
                    if (apicMainContent) {
                        // Temporarily disconnect the observer to prevent infinite loop
                        observer.disconnect();
                        // Apply the styles
                        apicMainContent.style.display = 'flex';
                        apicMainContent.style.flexDirection = 'column';
                        apicMainContent.style.padding = '62px 15px';
                        // Reconnect the observer
                        observer.observe(document.body, { childList: true, subtree: true });
                    }
                }
            }
        });
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    /*role base product visibility*/
    const isPartner = document.body.classList.contains('role-partner');
    const redemption = document.body.classList.contains('role-redemption');
    const earning = document.body.classList.contains('role-earning');
    const earningRedemption = document.body.classList.contains('role-earning-redemption');
    const noUser = document.body.classList.contains('role-nouser');



    const businessDomains = document.querySelector('.business-domains');
    const partnerDomain = document.querySelector('.partner-domain');
    const earningAccess = document.querySelector('.earning-access');
    const redemptionAccess = document.querySelector('.redemption-access');
    const apps = document.querySelector('.apps');
    const apiProducts = document.querySelector('.api-products');
    const search = document.querySelector('.opensearch');




    if (isPartner || redemption || earning || earningRedemption) {
        // If body has 'role-partners', hide 'business-domains and search' and show 'partner-domain'
        if (businessDomains) businessDomains.style.display = 'none';
        if (apps) apps.style.display = 'none';
        if (apiProducts) apiProducts.style.display = 'none';
        if (search) search.style.display = 'none';
        if (partnerDomain) partnerDomain.style.display = '';
    } else {
        // Otherwise, show 'business-domains' and hide 'partner-domain'
        if (businessDomains) businessDomains.style.display = '';
        if (partnerDomain) partnerDomain.style.display = 'none';
    }

    if (earning && redemption) {
        if (earningAccess) earningAccess.style.display = '';
        if (redemptionAccess) redemptionAccess.style.display = '';
    } else if (earning) {
        if (redemptionAccess) redemptionAccess.style.display = 'none';
    } else if (redemption) {
        if (earningAccess) earningAccess.style.display = 'none';
    } else if (noUser) {
        if (businessDomains) businessDomains.style.display = 'none';
        if (partnerDomain) partnerDomain.style.display = 'none';
        if (apps) apps.style.display = 'none';
        if (apiProducts) apiProducts.style.display = 'none';
        if (search) search.style.display = 'none';

    }

    const urlSubscription = window.location.pathname;

    const nodeMatch = urlSubscription.match(/\/node\/\d+/);

    // Check if it includes subscriptions
    const isSubscriptions = urlSubscription.includes('/subscriptions');
    const isActivity = urlSubscription.includes('/activity');
    const contentRegion = document.querySelector('.region-content');

    if (nodeMatch && !isSubscriptions && !isActivity) {
        contentRegion.classList.add('custom-deshboardsec');
        contentRegion.insertAdjacentHTML("afterbegin", `
    <div class="bg-images">
        <div class="circle-1"></div>
        <div class="circle-2"></div>
    </div>
  `);
    } else if (nodeMatch && isSubscriptions) {
        contentRegion.classList.add('custom-subscription');
        contentRegion.insertAdjacentHTML("afterbegin", `
    <div class="bg-images">
        <div class="circle-1"></div>
        <div class="circle-2"></div>
    </div>
  `);

    } else if (nodeMatch && isActivity) {
        contentRegion.classList.add('custom-notificationsec');
        contentRegion.insertAdjacentHTML("afterbegin", `
    <div class="bg-images">
        <div class="circle-1"></div>
        <div class="circle-2"></div>
    </div>
  `);
    }


    /*role base product visibility*/

    /*for search api modifications*/

    if (window.location.href.includes("search-api?search_api_fulltext")) {
        // Select all elements with class 'field--label'
        const contentRegions = document.querySelector('.region-content');
        contentRegions.insertAdjacentHTML("afterbegin", `
        <div class="bg-images">
            <div class="circle-1"></div>
            <div class="circle-2"></div>
        </div>
      `);

        const labels = document.querySelectorAll('.field--label');

        // Add 'tag-header' class to each matched element
        labels.forEach(label => {
            label.classList.add('tag-header');
        });
    }

    /*for search api modifications*/


    /* for nav bar menu responsive design*/

    // const apicStickyHeader = document.querySelector(".apicStickyHeader");
    // apicStickyHeader.classList.add("custom-headersec");

    // const navCollapse = document.querySelector('.navbar-collapse .menu.nav');

    // if (navCollapse) {
    //     const newHTML = `
    //     <div class="region region-navigation-right" aria-label="navigation_right">
    //       <nav role="navigation" aria-labelledby="block-marketplace-latest-login-menu" id="block-marketplace-latest-login" class="block-login">
    //         <h2 class="visually-hidden" id="block-marketplace-latest-login-menu">Log in</h2>
    //         <ul class="menu menu--login nav">
    //           <li class="first">
    //             <a href="/sandbox/user/register" title="Create a new account" data-drupal-link-system-path="user/register">Create account</a>
    //           </li>
    //           <li class="last">
    //             <a href="/sandbox/user/login" title="Sign in to your account" data-drupal-link-system-path="user/login">Sign in</a>
    //           </li>
    //         </ul>
    //       </nav>
    //       <section id="block-marketplace-latest-searchicon" class="block block-simple-block block-search-icon block-simple-blocksearch-icon clearfix" aria-label="search icon">
    //         <div class="imageContainer">
    //           <a class="opensearch2" title="Search this site" href="#">
    //             <svg role="img" aria-labelledby="ibmapimSearchTitle" width="24" height="24" viewBox="0 0 32 32" fill-rule="evenodd">
    //               <title id="ibmapimSearchTitle">Search this site</title>
    //               <path d="M30,28.59,22.45,21A11,11,0,1,0,21,22.45L28.59,30ZM5,14a9,9,0,1,1,9,9A9,9,0,0,1,5,14Z" transform="translate(0 0)"></path>
    //             </svg>
    //           </a>
    //         </div>
    //       </section>
    //     </div>
    //   `;

    //     // Parse the newHTML string into a DOM element (the outer div)
    //     const parser = new DOMParser();
    //     const doc = parser.parseFromString(newHTML, 'text/html');
    //     const regionDiv = doc.body.firstElementChild;

    //     // Insert the <div class="region region-navigation-right"> after the UL
    //     navCollapse.parentNode.insertBefore(regionDiv, navCollapse.nextSibling);






    // }




    // // Select the target UL in .navbar-collapse
    // const navCollapseList = document.querySelector('.navbar-collapse .menu.nav');

    // // Move login menu items
    // const loginMenu = document.querySelector('.region.region-navigation-right .menu.menu--login.nav');
    // if (loginMenu && navCollapseList) {
    //     loginMenu.querySelectorAll('li').forEach(li => {
    //         navCollapseList.appendChild(li.cloneNode(true));
    //     });
    // }
    // // Move organization menu items
    // const orgMenu = document.querySelector('#block-marketplace-latest-consumerorganizationselection .dropitmenu-submenu');
    // if (orgMenu && navCollapseList) {
    //     orgMenu.querySelectorAll('li').forEach(li => {
    //         // Skip disabled or currently selected items
    //         const isDisabled = li.hasAttribute('disabled');
    //         const isSelected = li.hasAttribute('selected');
    //         if (isDisabled || isSelected) {
    //             return;
    //         }

    //         navCollapseList.appendChild(li.cloneNode(true));
    //     });
    // }

    // // Move account menu items
    // const accountMenu = document.querySelector('.region.region-navigation-right .account-menu .dropit-submenu');
    // if (accountMenu && navCollapseList) {
    //     accountMenu.querySelectorAll('li').forEach(li => {
    //         const link = li.querySelector('a[href]');
    //         if (link && link.getAttribute('href') === '/sandbox/user/change-password') {
    //             return; // Skip "Change password"
    //         }

    //         const trigger = li.querySelector('a.trigger');
    //         if (trigger && trigger.textContent.trim() === '') {
    //             const nextElem = trigger.nextElementSibling;
    //             if (nextElem && nextElem.tagName === 'A') {
    //                 trigger.remove(); // Remove only the empty .trigger link
    //             }
    //         }

    //         navCollapseList.appendChild(li.cloneNode(true));
    //     });
    // }

    // // Target the section
    // const searchIconSection = document.querySelector('#block-marketplace-latest-searchicon');

    // // Proceed only if both elements exist
    // if (searchIconSection && navCollapseList) {
    //     // Clone the section
    //     const searchItem = document.createElement('li');
    //     searchItem.classList.add('searching-responsive');

    //     // Move the section inside the new <li>
    //     searchItem.appendChild(searchIconSection.cloneNode(true));

    //     // Insert as the first item in the nav list
    //     navCollapseList.insertBefore(searchItem, navCollapseList.firstChild);
    // }



    const mediaQuery = window.matchMedia('(max-width: 767px)');

    function moveNavItemsForMobile() {
        // Clear previously added items to avoid duplicates
        const existingItems = document.querySelectorAll('.navbar-collapse .menu.nav .searching-responsive, .navbar-collapse .menu.nav .moved-item');
        existingItems.forEach(item => item.remove());

        const navCollapseList = document.querySelector('.navbar-collapse .menu.nav');
        if (!navCollapseList) return;

        // Move login menu items
        const loginMenu = document.querySelector('.region.region-navigation-right .menu.menu--login.nav');
        if (loginMenu) {
            loginMenu.querySelectorAll('li').forEach(li => {
                const clone = li.cloneNode(true);
                clone.classList.add('moved-item');
                navCollapseList.appendChild(clone);
            });
        }

        // Move organization menu items
        const orgMenu = document.querySelector('#block-marketplace-latest-consumerorganizationselection .dropitmenu-submenu');
        if (orgMenu) {
            orgMenu.querySelectorAll('li').forEach(li => {
                const isDisabled = li.hasAttribute('disabled');
                const isSelected = li.hasAttribute('selected');
                if (isDisabled || isSelected) return;

                const clone = li.cloneNode(true);
                clone.classList.add('moved-item');
                navCollapseList.appendChild(clone);
            });
        }

        // Move account menu items
        const accountMenu = document.querySelector('.region.region-navigation-right .account-menu .dropit-submenu');
        if (accountMenu) {
            accountMenu.querySelectorAll('li').forEach(li => {
                const link = li.querySelector('a[href]');
                if (link && link.getAttribute('href') === '/sandbox/user/change-password') return;

                const trigger = li.querySelector('a.trigger');
                if (trigger && trigger.textContent.trim() === '') {
                    const nextElem = trigger.nextElementSibling;
                    if (nextElem && nextElem.tagName === 'A') {
                        trigger.remove();
                    }
                }

                const clone = li.cloneNode(true);
                clone.classList.add('moved-item');
                navCollapseList.appendChild(clone);
            });
        }

        // Insert search icon section
        const searchIconSection = document.querySelector('#block-marketplace-latest-searchicon');
        if (searchIconSection) {
            const searchItem = document.createElement('li');
            searchItem.classList.add('searching-responsive', 'moved-item');

            // Clone the node deeply
            const clonedSection = searchIconSection.cloneNode(true);

            // Find the <a> tag with class 'opensearch' inside the clone and replace its class
            const openSearchLink = clonedSection.querySelector('a.opensearch');
            if (openSearchLink) {
                openSearchLink.classList.remove('opensearch');
                openSearchLink.classList.add('opensearch2');
            }

            searchItem.appendChild(clonedSection);
            navCollapseList.insertBefore(searchItem, navCollapseList.firstChild);
        }
    }

    function restoreNavItemsToOriginal() {
        // Remove only the items we added
        const movedItems = document.querySelectorAll('.navbar-collapse .menu.nav .searching-responsive, .navbar-collapse .menu.nav .moved-item');
        movedItems.forEach(item => item.remove());
    }

    // Initial run
    if (mediaQuery.matches) {
        moveNavItemsForMobile();
    }

    // Listen to media query changes
    mediaQuery.addEventListener('change', (e) => {
        if (e.matches) {
            moveNavItemsForMobile();
        } else {
            restoreNavItemsToOriginal();
        }
    });

    /* for nav bar menu responsive design*/




    if (window.location.pathname.includes('/FAQ')) {
        // Select the div with class 'layout--onecol'
        const faqSection = document.querySelector('.layout--onecol');
        // If it exists, add the class 'custom-faqsec'
        if (faqSection) {
            faqSection.classList.add('custom-faqsec');
        }
    }






});


document.addEventListener("DOMContentLoaded", function() {
    const signinLink = document.querySelector('a[href="/sandbox/user/login"]');
    if (signinLink) {
        signinLink.addEventListener("click", function() {
            localStorage.setItem("fromSigninButton", "true");
        });
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const redirectFlag = localStorage.getItem("fromSigninButton");
    if (redirectFlag === "true") {

        document.body.style.display = "none";
        localStorage.removeItem("fromSigninButton");

        // Wait briefly, then trigger the Sign in with MFA button
        setTimeout(() => {
            const mfaButton = document.querySelector('a.registry-button.generic-button.button');
            if (mfaButton) {
                mfaButton.click();
            } else {
                // Fallback in case button not found
                console.warn("MFA button not found.");
                // document.body.style.visibility = "visible";

            }
        }, 100); // adjust delay if needed
    } else {
        // Normal page load

        const loginForm = document.querySelector(".apic-user-form-login");
        if (loginForm !== null) {
            // Make the element visible if it was hidden using visibility
            loginForm.style.visibility = "visible";

            // Optional: if it was hidden using display:none
            // loginForm.style.display = "block"; // or "flex", "inline-block", etc.
        }
    }
});




document.addEventListener('DOMContentLoaded', function() {
    const parent = document.querySelector('.apicSubscribeAppForm');

    if (parent) {
        const createAppLink = parent.querySelector('a[href="/sandbox/application/new/modal"]');
        if (createAppLink) {
            createAppLink.href = '/sandbox/application/new';
        }
    }

    document.querySelectorAll('form.user-login-form.pwd-see a.registry-button.generic-button.button').forEach(function(link) {
        try {
            const originalHref = link.getAttribute('href');
            const redirectMatch = originalHref.match(/([?&]redirect_uri=)([^&]+)/);

            // Update redirect_uri if it matches the original public domain
            if (redirectMatch && redirectMatch[2].includes('test.developer.api-marketplace.alrajhibank.com.sa')) {
                const oldUri = decodeURIComponent(redirectMatch[2]);
                const newUri = oldUri.replace(
                    'https://test.developer.api-marketplace.alrajhibank.com.sa',
                    'https://apimp-apic-b2a7a046-portal-web-mp-cp4i-nprd.apps.ocp.np4sitcl01.alrajhi.bank'
                );
                const newHref = originalHref.replace(redirectMatch[0], `${redirectMatch[1]}${encodeURIComponent(newUri)}`);
                link.setAttribute('href', newHref);
            }

            // Change the display text in the span
            const span = link.querySelector('span.registry-name');
            if (span) {
                span.textContent = 'Sign in with MFA';
            }

        } catch (e) {
            console.error('Update failed:', e);
        }
    });



    document.querySelectorAll(".faq-question").forEach(question => {
        question.addEventListener("click", function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector(".faq-toggle path");

            // Toggle answer visibility
            answer.style.display = answer.style.display === "block" ? "none" : "block";

            // Toggle icon rotation
            if (answer.style.display === "block") {
                icon.setAttribute("d", "M34.618 30.5945C34.1086 31.1352 33.2827 31.1352 32.7733 30.5945L25 22.3427L17.2267 30.5945C16.7173 31.1352 15.8914 31.1352 15.382 30.5945C14.8727 30.0538 14.8727 29.177 15.382 28.6363L24.0777 19.4055C24.5871 18.8648 25.413 18.8648 25.9224 19.4055L34.618 28.6363C35.1273 29.177 35.1273 30.0538 34.618 30.5945Z");
            } else {
                icon.setAttribute("d", "M15.382 19.4055C15.8914 18.8648 16.7173 18.8648 17.2267 19.4055L25 27.6573L32.7733 19.4055C33.2827 18.8648 34.1086 18.8648 34.618 19.4055C35.1273 19.9462 35.1273 20.823 34.618 21.3637L25.9224 30.5945C25.413 31.1352 24.5871 31.1352 24.0777 30.5945L15.382 21.3637C14.8727 20.823 14.8727 19.9462 15.382 19.4055Z");
            }
        });
    });
});
document.addEventListener("DOMContentLoaded", function() {


    const coreTab = document.querySelector('.core-banking-tab');
    const subTabs = document.getElementById('coreBankingSubtabs');

    if (subTabs) {
        subTabs.style.display = "none";
    }


    if (coreTab && subTabs) {
        coreTab.addEventListener('click', function() {
            subTabs.style.display = (subTabs.style.display === 'none' || subTabs.style.display === '') ?
                'block' :
                'none';
        });
    }


    if (window.location.href.includes('/search-api')) {
        const title = document.querySelector('#page-node-title');
        if (title) {
            title.style.paddingLeft = 'unset';
            title.style.width = '100%';
        }


        const header = document.querySelector('h1.js-quickedit-page-title.page-header');
        if (header) {
            header.style.backgroundColor = 'transparent';
            header.style.paddingBottom = '3rem';
            header.style.fontSize = '40px';
        }
    }


    function addBackgroundImages(selector) {
        const targetElement = document.querySelector(selector);

        if (targetElement) {
            const bgImagesDiv = document.createElement("div");
            bgImagesDiv.classList.add("bg-images");

            bgImagesDiv.innerHTML = `
                <div class="circle-1"></div>
                <div class="circle-2"></div>
            `;

            targetElement.insertBefore(bgImagesDiv, targetElement.firstChild);
        }
    }

    addBackgroundImages("#contact-feedback-form");
    addBackgroundImages(".apic-login-wrapper");

});
//modifications for change of password
document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("h1.page-header");

    if (header && header.textContent.trim() === "Change Password") {
        header.insertAdjacentHTML('beforeend', `
            <div class="bg-images">
                <p class="pattern"></p>
                <div class="circle-1"></div>
                <div class="circle-2"></div>
            </div>
        `);
    }
});
//modifications for edit user
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.href.includes("/user/") && window.location.href.includes("/edit")) {
        let element = document.querySelector(".region-content");
        if (element) {
            element.classList.add("custom-editsec");

        }

        const header = document.querySelector("h1.page-header");
        if (header) {
            header.insertAdjacentHTML('beforeend', `
            <div class="bg-images">
                <div class="circle-1"></div>
                <div class="circle-2"></div>
            </div>
        `);
        }
    }
});

//modifications for change password
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.href.includes("/user/") && window.location.href.includes("/change-password")) {
        let element = document.querySelector(".region-content");
        if (element) {
            element.classList.add("custom-changepass");

        }
    }
});


//modifications for View Profile
document.addEventListener("DOMContentLoaded", () => {
    const currentPath = window.location.pathname;
    const userUrlPattern = /\/user\/\d+\/?$/;

    if (userUrlPattern.test(currentPath)) {
        const el = document.querySelector('.region-content');
        if (el) {
            el.classList.add('custom-viewprofile');
            el.insertAdjacentHTML("afterbegin", `
          <div class="bg-images">
              <div class="circle-1"></div>
              <div class="circle-2"></div>
          </div>
        `);
        }
    }
});








//modifications to apply figma on terms and conditions
document.addEventListener("DOMContentLoaded", function() {
    if (window.location.href.includes("/tsandcs")) {
        const pageNodeTitle = document.querySelector("#page-node-title");
        if (pageNodeTitle) {
            pageNodeTitle.style.display = "block";
        }

        let titleElement = document.querySelector("span#page-node-title");
        if (titleElement) {
            titleElement.innerHTML = "Terms<br>and Conditions";
        }

        // Create background images
        const bgImagesDiv = document.createElement("div");
        bgImagesDiv.classList.add("bg-images");
        bgImagesDiv.innerHTML = `
            <div class="circle-1"></div>
            <div class="circle-2"></div>
        `;

        // Create wrapper and image container
        const wrapperDiv = document.createElement("div");
        wrapperDiv.classList.add("wrapperimagetext-termsconditions");

        const termsConditionsImageDiv = document.createElement("div");
        termsConditionsImageDiv.classList.add("termsconditions-image");

        const paragraph = document.querySelector(
            "div.field.field--name-body.field--type-text-with-summary.field--label-hidden.field--item p"
        );

        if (paragraph) {
            paragraph.classList.add("custom-termsconditions-par");

            // Insert bg-images BEFORE paragraph
            const bodyContainer = paragraph.parentNode;
            bodyContainer.insertBefore(bgImagesDiv, paragraph);

            // Append image and paragraph to wrapper
            wrapperDiv.appendChild(termsConditionsImageDiv);
            wrapperDiv.appendChild(paragraph);

            // Insert wrapper after bgImagesDiv using insertBefore with nextSibling
            if (bgImagesDiv.nextSibling) {
                bodyContainer.insertBefore(wrapperDiv, bgImagesDiv.nextSibling);
            } else {
                bodyContainer.appendChild(wrapperDiv);
            }
        }

        // Remove padding-right from .container
        const container = document.querySelector(".container");
        if (container) {
            container.style.paddingRight = "0px";
        }

        // Add decorative background to header
        const header = document.querySelector(".page-header");
        if (header) {
            header.classList.add("custom-termsconditions");

            const wrapper = document.createElement("div");
            wrapper.className = "rotated-bg-wrapper-tsandcond";
            const innerDiv = document.createElement("div");
            innerDiv.className = "termsconditions-bg";
            wrapper.appendChild(innerDiv);
            header.prepend(wrapper);
        }

        // ✅ Apply margin and padding to h1.page-header
        // const h1Header = document.querySelector("h1.page-header");
        // if (h1Header) {
        //     h1Header.style.margin = "0 2rem";
        //     h1Header.style.padding = "1rem 0rem";
        // }
    }
});




//modifications to apply figma on privacy and policy
document.addEventListener("DOMContentLoaded", function() {
    if (window.location.href.includes("/privacy")) {
        const pageNodeTitle = document.querySelector("#page-node-title");
        if (pageNodeTitle) {
            pageNodeTitle.style.display = "block";
        }

        // Create background images (always created)
        const bgImagesDiv = document.createElement("div");
        bgImagesDiv.classList.add("bg-images");
        bgImagesDiv.innerHTML = `
                <div class="circle-1"></div>
                <div class="circle-2"></div>
            `;

        // Create wrapper and image div
        const wrapperDiv = document.createElement("div");
        wrapperDiv.classList.add("wrapperimagetext-privacy");

        const privacyImageDiv = document.createElement("div");
        privacyImageDiv.classList.add("privacy-image");

        // Paragraph selection
        const paragraph = document.querySelector(
            "div.field.field--name-body.field--type-text-with-summary.field--label-hidden.field--item p"
        );

        if (paragraph) {
            paragraph.classList.add("custom-privacy-par");

            // Insert bg-images before paragraph
            paragraph.parentNode.insertBefore(bgImagesDiv, paragraph);

            // Move paragraph into wrapper with image
            wrapperDiv.appendChild(privacyImageDiv);
            wrapperDiv.appendChild(paragraph);

            // Now insert wrapper *after paragraph's original container*
            bgImagesDiv.parentNode.insertBefore(wrapperDiv, bgImagesDiv.nextSibling);
        } else {
            const bodyField = document.querySelector(
                "div.field.field--name-body.field--type-text-with-summary.field--label-hidden.field--item"
            );
            if (bodyField) {
                bodyField.prepend(bgImagesDiv);
            }
        }

        // Remove padding-right from .container
        const container = document.querySelector(".container");
        if (container) {
            container.style.paddingRight = "0px";
        }

        const header = document.querySelector(".page-header");
        if (header) {
            header.classList.add("custom-termsconditions"); // Add class


        }

    }
});


document.addEventListener('DOMContentLoaded', function() {
    const loginWrapper = document.querySelector(".apic-login-wrapper");
    if (loginWrapper) {
        const style = document.createElement("style");
        style.innerHTML = `
            .bx--global-light-ui .apic-user-form-wrapper .form-group {
                margin-bottom: 0 !important;
                align-items: center !important;
            }
        `;
        document.head.appendChild(style);
    }

});

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.href.includes('/taxonomy/term')) {
        // Select all 'apicTeaser' divs
        document.querySelectorAll('.apicTeaser').forEach(function(teaserDiv) {
            // Select all 'apicTeaserMain' divs
            document.querySelectorAll('.apicTeaserMain').forEach(function(teaserMain) {
                // Check if there are at least two divs inside each 'apicTeaserMain'
                const divs = teaserMain.querySelectorAll('div');
                if (divs.length > 1) {
                    divs[1].remove(); // Remove the second div
                }
            });
            // Hide all 'basic-page' divs inside each 'apicTeaser'
            teaserDiv.querySelectorAll('.basic-page').forEach(function(basicPageDiv) {
                basicPageDiv.style.display = 'none';
            });

            // Show the element with id 'search-term-result' inside each 'apicTeaser'
            const searchTermResult = teaserDiv.querySelector('#search-term-result');
            if (searchTermResult) {
                searchTermResult.style.display = 'block';
            }
        });

    }

    if (window.location.pathname.includes("/product")) {
        let element = document.querySelector(".region-content");
        if (element) {
            element.classList.add("custom-APIproduct");
            element.insertAdjacentHTML("afterbegin", `
                    <div class="bg-images">
                        <p class="pattern"></p>
                        <div class="circle-1"></div>
                        <div class="circle-2"></div>
                    </div>
                `);;
        }

        let header = document.getElementById("pageHeader");
        if (header) {
            header.insertAdjacentHTML("afterend", `
                <p class="main-pera">
                    Our APIs ensure seamless integration, secure access, and reliable
                    communication for efficient development.
                </p>
            `);
        }

        let blazy = document.querySelector(".blazy.blazy--view.blazy--view--products");
        if (blazy) {
            blazy.classList.add("custom-productcards");
        }

    }

    if (window.location.pathname.includes("/application")) {
        let element = document.querySelector(".region-content");
        if (element) {
            element.classList.add("custom-application");
            element.insertAdjacentHTML("afterbegin", `
                    <div class="bg-images">
                        <p class="pattern"></p>
                        <div class="circle-1"></div>
                        <div class="circle-2"></div>
                    </div>
                `);;
        }

        let blazy = document.querySelector(".blazy.blazy--view.blazy--view--applications");
        if (blazy) {
            blazy.classList.add("custom-applicationcards");
        }
        const header = document.querySelector(".page-header");
        const appWrapper = document.querySelector(".apicNewAppWrapper");

        if (header && !appWrapper) {
            header.insertAdjacentHTML("afterend", `
      <p class="noapptext">
        Please ask your administrator to allow creating apps
      </p>
    `);

        }
    }
});

// document.addEventListener("DOMContentLoaded", function() {
//     // Function to extract the value of a parameter from the URL
//         function getURLParameter(url, name) {
//         name = name.replace(/[\[\]]/g, "\\$&");
//         var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
//             results = regex.exec(url);
//         if (!results) return null;
//         if (!results[2]) return '';
//         return decodeURIComponent(results[2].replace(/\+/g, " "));
//         }

//         // Get the URL of the current page
//         var currentURL = window.location.href;

//         // Get the value of the search_api_fulltext parameter from the URL
//         var searchText = getURLParameter(currentURL, 'search_api_fulltext');

//         // If the parameter exists and has a value
//         if (searchText && searchText.trim() !== "") {
//         // Highlight the text on the page
//         var elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li'); // Target <p>, <h1>-<h6>, <li> elements
//         elements.forEach(function(element) {
//             // Check if the element contains an <a> tag
//             var aTag = element.querySelector('a');
//             if (aTag) {
//                 // Highlight the innerHTML of the <a> tag only
//                 var innerHTML = aTag.innerHTML;
//                 var newHTML = innerHTML.replace(new RegExp(searchText, 'g'), '<span class="highlight">' + searchText + '</span>');
//                 aTag.innerHTML = newHTML;
//             } else {
//                 // Highlight the element's innerText
//                 var innerText = element.innerText;
//                 var newText = innerText.replace(new RegExp(searchText, 'g'), '<span class="highlight">' + searchText + '</span>');
//                 element.innerHTML = newText;
//             }
//         });
//         }
// });

// document.addEventListener('DOMContentLoaded', function() {
//   var openSearchButton = document.querySelector('.opensearch');
//   var searchContainer = document.querySelector('.bx--global-light-ui .views-exposed-form');

//   openSearchButton.addEventListener('click', function() {
//     if (searchContainer.style.display === 'none' || searchContainer.style.display === '') {
//       searchContainer.style.display = 'flex';
//     } else {
//       searchContainer.style.display = 'none';
//     }
//   });
// });



document.addEventListener("DOMContentLoaded", function() {
    if (window.location.pathname.includes('/myorg/invite')) {
        const originalForm = document.querySelector('#consumerorg-invite-user-form');
        const roleRadios = originalForm.querySelectorAll('input[type="radio"][name="role"]');
        const roleLabels = originalForm.querySelectorAll('label[for^="edit-role-"]');

        // Create a new custom form
        const newForm = document.createElement('form');
        newForm.id = 'custom-invite-form';

        newForm.innerHTML = `
      <div>
        <label>First Name</label>
        <input type="text" id="first_name" required>
      </div>
      <div>
        <label>Last Name</label>
        <input type="text" id="last_name" required>
      </div>
      <div>
        <label>Email</label>
        <input type="email" id="email" required>
      </div>
      <div id="roles-container">
        <p><strong>Select Role:</strong></p>
      </div>
      <div class="invite-button">
      <button type="submit">Invite User</button>
      <button type="reset">Cancel</button>
      </div>
    `;

        const rolesContainer = newForm.querySelector('#roles-container');

        roleRadios.forEach((originalRadio, index) => {
            const newId = `custom-role-${index}`;

            const originalValue = originalRadio.value;
            const orgId = originalValue.split('/orgs/')[1] ?
                originalValue.split('/orgs/')[1].split('/')[0] :
                '';

            const roleId = originalValue.split('/roles/')[1] ?
                originalValue.split('/roles/')[1].split('/')[0] :
                '';
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'user_role';
            radio.id = newId;
            radio.value = JSON.stringify({ orgId, roleId });

            const label = roleLabels[index] ? roleLabels[index].cloneNode(true) : null;
            if (label) {
                label.setAttribute('for', newId);
            }

            const wrapper = document.createElement('div');
            wrapper.appendChild(radio);
            if (label) wrapper.appendChild(label);
            rolesContainer.appendChild(wrapper);
        });

        // Replace the old form completely with the new one
        originalForm.replaceWith(newForm);

        newForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const firstName = document.getElementById('first_name').value.trim();
            const lastName = document.getElementById('last_name').value.trim();
            const selectedRole = newForm.querySelector('input[name="user_role"]:checked');

            if (!selectedRole) {
                alert('Please select a role.');
                return;
            }

            const submitBtn = newForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Inviting...';

            // Optional loader icon
            let loader = document.createElement('span');
            loader.className = 'loader';
            loader.style.marginLeft = '10px';
            loader.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
            submitBtn.appendChild(loader);

            const { orgId, roleId } = JSON.parse(selectedRole.value);

            const payload = {
                user: {
                    email: email,
                    first_name: firstName,
                    last_name: lastName
                },
                consumer_org: {
                    id: orgId,
                    roles: [roleId]
                }
            };

            fetch('/sandbox/invite-user-proxy', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                .then(async response => {
                    const data = await response.json();
                    if (!response.ok) {
                        // Return the error response data
                        throw data;
                    }
                    return data;
                })
                .then(data => {
                    alert('✅ User invited successfully!');
                    newForm.reset();
                })
                .catch(error => {
                    if (error.messages && Array.isArray(error.messages)) {
                        // Backend validation errors
                        alert('⚠️ ' + error.messages.join('\n'));
                    } else {
                        // Generic error
                        alert('An error occurred while inviting the user.');
                        console.error('Error:', error);
                    }
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Invite User';
                });
        });
    }
});


document.addEventListener("DOMContentLoaded", function() {
    var openSearchButton = document.querySelector(".opensearch");

    openSearchButton.addEventListener("click", function() {
        var searchContainer = document.querySelector(
            "section#block-marketplace-latest-exposedformsearch-apipage-1"
        );

        console.log(searchContainer); // Log searchContainer to debug

        if (searchContainer) {
            if (
                searchContainer.style.display === "none" ||
                searchContainer.style.display === ""
            ) {
                searchContainer.style.display = "flex";
            } else {
                searchContainer.style.display = "none";
            }
        } else {
            console.log("Search container not found");
        }
    });

    var openSearchButton2 = document.querySelector(".opensearch2");
    if (openSearchButton2) {
        openSearchButton2.addEventListener("click", function() {
            var searchContainer = document.querySelector(
                "section#block-marketplace-latest-exposedformsearch-apipage-1"
            );

            console.log(searchContainer); // Log searchContainer to debug

            if (searchContainer) {
                if (
                    searchContainer.style.display === "none" ||
                    searchContainer.style.display === ""
                ) {
                    searchContainer.style.display = "flex";
                } else {
                    searchContainer.style.display = "none";
                }
            } else {
                console.log("Search container not found");
            }
        });
    }



});

function show(expand) {
    if (document.getElementById(expand)) {
        if (
            document.getElementById(expand).style.display == "" ||
            document.getElementById(expand).style.display == "none"
        )
            document.getElementById(expand).style.display = "block";
        else document.getElementById(expand).style.display = "none";
    }
}

function toggle(img1, img2) {
    if (
        document.getElementById("img1").style.display == "" ||
        document.getElementById("img1").style.display == "none"
    ) {
        document.getElementById("img1").style.display = "block";
        document.getElementById("img2").style.display = "none";
    } else {
        document.getElementById("img1").style.display = "none";
        document.getElementById("img2").style.display = "block";
    }
}

function tgl(myBtn) {
    var myButton = document.getElementById(myBtn);
    if (myButton) {
        if (myButton.value == "+") {
            myButton.value = "x";
            myButton.src =
                "https://test.developer.api-marketplace.alrajhibank.com.sa/sandbox/sites/sandbox.apic-nonpr-766d725d-portal-web-cp4i-nprd.apimp-nprd-cl01-de8fb88b0db8c47d4745b3af8ac7158d-0000.eu-de.containers.appdomain.cloud/files/inline-images/xmark.jpg";
        } else {
            myButton.value = "+";
            myButton.src =
                "https://test.developer.api-marketplace.alrajhibank.com.sa/sandbox/sites/sandbox.apic-nonpr-766d725d-portal-web-cp4i-nprd.apimp-nprd-cl01-de8fb88b0db8c47d4745b3af8ac7158d-0000.eu-de.containers.appdomain.cloud/files/inline-images/plus.png";
        }
    }
}

//Market Place Products-business domains page
function tglApi1(myArr) {
    var myArrow = document.getElementById(myArr);
    if (myArrow) {
        if (myArrow.value == "^") {
            myArrow.value = "-";
            myArrow.src =
                "https://test.developer.api-marketplace.alrajhibank.com.sa/sandbox/sites/sandbox.apic-nonpr-766d725d-portal-web-cp4i-nprd.apimp-nprd-cl01-de8fb88b0db8c47d4745b3af8ac7158d-0000.eu-de.containers.appdomain.cloud/themes/marketplace_latest/css/images/arrowbelow.png";
        } else {
            myArrow.value = "^";
            myArrow.src =
                "https://test.developer.api-marketplace.alrajhibank.com.sa/sandbox/sites/sandbox.apic-nonpr-766d725d-portal-web-cp4i-nprd.apimp-nprd-cl01-de8fb88b0db8c47d4745b3af8ac7158d-0000.eu-de.containers.appdomain.cloud/themes/marketplace_latest/css/images/arrowup.png";
        }
    }
}

function generateCode(language) {
    const curlCommand = document.getElementById("curlCommand").value;

    let generatedCode = "";

    if (language === "ruby") {
        generatedCode = generateRubyCode(curlCommand);
    } else if (language === "php") {
        generatedCode = generatePHPCode(curlCommand);
    } else if (language === "node") {
        generatedCode = generateNodeCode(curlCommand);
    }

    const codeElement = document.getElementById("generatedCode");
    codeElement.textContent = generatedCode;
}

function generateRubyCode(curlCommand) {
    const rubyCode = `
require 'net/http'

url = '${curlCommand}'
uri = URI(url)

http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true if uri.scheme === 'https'

request = Net::HTTP::Get.new(uri)
# Add headers if needed
# request['Header-Name'] = 'Header-Value'

response = http.request(request)
puts response.body
`;

    return rubyCode;
}

function generatePHPCode(curlCommand) {
    const phpCode = `<?php
$url = '${curlCommand}';

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, false);

// Add headers if needed
// curl_setopt($ch, CURLOPT_HTTPHEADER, array(
//   'Header-Name: Header-Value',
// ));

$response = curl_exec($ch);
curl_close($ch);

echo $response;
`;

    return phpCode;
}

function generateNodeCode(curlCommand) {
    const nodeCode = `const http = require('http');

const options = {
  hostname: '${curlCommand}',
  method: 'GET',
  // Add headers if needed
  // headers: {
  //   'Header-Name': 'Header-Value',
  // },
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(data);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.end();
`;

    return nodeCode;
}

function toggleBodyField() {
    const method = document.getElementById("method").value;
    const bodyField = document.getElementById("bodyField");
    bodyField.style.display = method === "POST" ? "block" : "none";
}

function homeImageFlip(textId) {
    // console.log("textID");
    // console.log(textId);

    // Hide all image elements
    document.querySelectorAll('.home-account-image, .home-insurance-image, .home-finance-image').forEach(el => {
        el.style.display = 'none';
    });



    // Show the relevant image and text section based on the clicked link
    if (textId === 'text2') {
        document.querySelector('.home-insurance-image').style.display = 'block';
    } else if (textId === 'text1') {
        document.querySelector('.home-account-image').style.display = 'block';
    } else if (textId === 'text3') {
        document.querySelector('.home-finance-image').style.display = 'block';
        document.getElementById(textId).style.display = 'block';
    } else {
        // Show the default image if no specific text is selected
        document.querySelector('.home-account-image').style.display = 'block';
    }
}
/****old dynamic curl function
/**function generateCurlCommand(url, headers, method, body) {
  let curlCommand = '';

  if (method) {
    curlCommand += `curl -X ${method.toUpperCase()} `;
  } else {
    curlCommand += 'curl ';
  }

  curlCommand += `'${url}'`;

  if (headers) {
    for (let header in headers) {
      curlCommand += ` -H '${header}: ${headers[header]}'`;
    }
  }

  if (method && method.toLowerCase() === 'post' && body) {
    // Escape single quotes in the body
    const escapedBody = body.replace(/'/g, "'\\''");
    curlCommand += ` -d '${escapedBody}'`;
  }

  return curlCommand;
}**/
function generateCurlCommand(url, method, headers) {
    let curlCommand = "";

    if (method) {
        curlCommand += `curl -X ${method.toUpperCase()} `;
    } else {
        curlCommand += "curl ";
    }

    curlCommand += `'${url}'`;

    if (headers) {
        for (let header in headers) {
            curlCommand += ` -H '${header}: ${headers[header]}'`;
        }
    }

    return curlCommand;
}

function generateAndDisplayCurl(event) {
    event.preventDefault();

    // Set the URL, method, and headers inside the function
    const url = "https://example.com"; // Replace 'https://example.com' with your desired URL
    const method = "get"; // Replace 'post' with your desired HTTP method ('get', 'put', 'delete', etc.)
    const headers = {
        "Content-Type": "application/json", // Replace with your desired headers
        Authorization: "Bearer YOUR_ACCESS_TOKEN", // Replace with any authorization headers
    };

    const curlCommand = generateCurlCommand(url, method, headers);
    document.getElementById("generatedCurl").textContent = curlCommand;
}

/**old dynamic generate curl function
/**function generateAndDisplayCurl(event) {
  event.preventDefault();

  const url = document.getElementById('url').value;
  const method = document.getElementById('method').value;
  const headersString = document.getElementById('headers').value;
  const body = document.getElementById('body').value;
  let headers = null;

  try {
    headers = JSON.parse(headersString);
  } catch (error) {
    alert('Invalid JSON format for headers');
    return;
  }

  const curlCommand = generateCurlCommand(url, headers, method, body);
  document.getElementById('generatedCurl').textContent = curlCommand;
}**/

function displayText(textId) {
    // Hide all text elements
    var textElements = document.querySelectorAll(".text");
    textElements.forEach(function(element) {
        element.style.display = "none";
    });

    // Display the clicked text element
    var text = document.getElementById(textId);
    text.style.display = "block";
}

/*var myElement = document.getElementById('myElement');

myElement.addEventListener('click', function() {
  myElement.style.backgroundColor = '#E9EEFD';
});


myElement.addEventListener('mouseout', function() {
  myElement.style.backgroundColor = 'transparent';
});*/

var listcolor = document.getElementById("listcolor");
if (listcolor) {
    listcolor.addEventListener("click", function() {
        listcolor.style.color = "#556ff8";
        listcolor.style.border = "2px solid #556ff8";
    });

    listcolor.addEventListener("mouseout", function() {
        listcolor.style.color = "#556ff8";
        listcolor.style.border = "2px solid #556ff8";
    });
}
var myElement = document.getElementById("myElement");
var isClicked = false;

myElement.addEventListener("click", function() {
    if (isClicked) {
        myElement.style.backgroundColor = "#E9EEFD";
    } else {
        myElement.style.backgroundColor = "#E9EEFD";
    }
    isClicked = !isClicked;
});

myElement.addEventListener("mouseout", function() {
    if (!isClicked) {
        myElement.style.backgroundColor = "#E9EEFD";
    }
});

/*function toggleDiv(divId) {
  var div = document.getElementById(divId);
  div.classList.toggle('hidden');
}*/

function showDiv(divId) {
    var div1 = document.getElementById("div1");
    var div2 = document.getElementById("div2");

    if (divId === "div1") {
        div1.classList.remove("hidden");
        div2.classList.add("hidden");
    } else if (divId === "div2") {
        div1.classList.add("hidden");
        div2.classList.remove("hidden");
    }
}

function responseText(errorId) {
    // Hide all text elements
    var textElements = document.querySelectorAll(".text");
    textElements.forEach(function(element) {
        element.style.display = "none";
    });

    // Display the clicked text element
    var text = document.getElementById(errorId);
    text.style.display = "block";
}

/*function showcode(divId) {
  var code1 = document.getElementById("response-rate");
  var code2 = document.getElementById("response-rate2");
  var code3 = document.getElementById("response-rate3");
  var code4 = document.getElementById("response-rate4");
  var code5 = document.getElementById("response-rate5");
  var code6 = document.getElementById("response-rate6");
  var code7 = document.getElementById("response-rate7");
  var code8 = document.getElementById("response-rate8");
  var code9 = document.getElementById("response-rate9");

  if (divId === "response-rate") {
    code1.style.display = "block";
    code2.style.display = "none";
    code3.style.display = "none";
    code4.style.display = "none";
    code5.style.display = "none";
    code6.style.display = "none";
    code7.style.display = "none";
    code8.style.display = "none";
    code9.style.display = "none";
  } else if (divId === "response-rate2") {
    code1.style.display = "none";
    code2.style.display = "block";
    code3.style.display = "none";
    code4.style.display = "none";
    code5.style.display = "none";
    code6.style.display = "none";
    code7.style.display = "none";
    code8.style.display = "none";
    code9.style.display = "none";
  }
  else if (divId === "response-rate3") {
    code1.style.display = "none";
    code2.style.display = "none";
    code3.style.display = "block";
    code4.style.display = "none";
    code5.style.display = "none";
    code6.style.display = "none";
    code7.style.display = "none";
    code8.style.display = "none";
    code9.style.display = "none";
  }
  else if (divId === "response-rate4") {
    code1.style.display = "none";
    code2.style.display = "none";
    code3.style.display = "none";
    code4.style.display = "block";
    code5.style.display = "none";
    code6.style.display = "none";
    code7.style.display = "none";
    code8.style.display = "none";
    code9.style.display = "none";
  }
  else if (divId === "response-rate5") {
    code1.style.display = "none";
    code2.style.display = "none";
    code3.style.display = "none";
    code4.style.display = "none";
    code5.style.display = "block";
    code6.style.display = "none";
    code7.style.display = "none";
    code8.style.display = "none";
    code9.style.display = "none";
  }
  else if (divId === "response-rate6") {
    code1.style.display = "none";
    code2.style.display = "none";
    code3.style.display = "none";
    code4.style.display = "none";
    code5.style.display = "none";
    code6.style.display = "block";
    code7.style.display = "none";
    code8.style.display = "none";
    code9.style.display = "none";
  }
  else if (divId === "response-rate7") {
    code1.style.display = "none";
    code2.style.display = "none";
    code3.style.display = "none";
    code4.style.display = "none";
    code5.style.display = "none";
    code6.style.display = "none";
    code7.style.display = "block";
    code8.style.display = "none";
    code9.style.display = "none";
  }
  else if (divId === "response-rate8") {
    code1.style.display = "none";
    code2.style.display = "none";
    code3.style.display = "none";
    code4.style.display = "none";
    code5.style.display = "none";
    code6.style.display = "none";
    code7.style.display = "none";
    code8.style.display = "block";
    code9.style.display = "none";
  }
  else if (divId === "response-rate9") {
    code1.style.display = "none";
    code2.style.display = "none";
    code3.style.display = "none";
    code4.style.display = "none";
    code5.style.display = "none";
    code6.style.display = "none";
    code7.style.display = "none";
    code8.style.display = "none";
    code9.style.display = "block";
  }
}*/

/**function filterMenuItems() {
  const searchText = searchBar.value.toLowerCase();
  const menuItems = document.getElementById('menuItems');

  for (let i = 0; i < menuItems.length; i++) {
    const menuItem = menuItems[i];
    const itemText = menuItem.innerText.toLowerCase();

    if (itemText.includes(searchText)) {
      menuItem.style.display = 'list-item';
    } else {
      menuItem.style.display = 'none';
    }
  }
}

const searchBar = document.getElementById('searchBar');
searchBar.addEventListener('input', filterMenuItems);**/

function search_menu() {
    let input = document.getElementById("searchbar").value;
    input = input.toLowerCase();
    let x = document.getElementsByClassName("menus");

    for (i = 0; i < x.length; i++) {
        if (!x[i].innerHTML.toLowerCase().includes(input)) {
            x[i].style.display = "none";
        } else {
            x[i].style.display = "list-item";
        }
    }
}

// JavaScript code
function search_menu() {
    let input = document.getElementById("searchbar").value;
    input = input.toLowerCase();
    let x = document.getElementsByClassName("apn-doc-menu");

    for (i = 0; i < x.length; i++) {
        if (!x[i].innerHTML.toLowerCase().includes(input)) {
            x[i].style.display = "none";
        } else {
            x[i].style.display = "block";
        }
    }
}

//MP
function faq(myBtn) {
    var myButton = document.getElementById(myBtn);
    if (myButton) {
        if (myButton.value == "+") {
            myButton.value = "x";
            myButton.src =
                "https://test.developer.api-marketplace.alrajhibank.com.sa/sandbox/sites/sandbox.apic-nonpr-766d725d-portal-web-cp4i-nprd.apimp-nprd-cl01-de8fb88b0db8c47d4745b3af8ac7158d-0000.eu-de.containers.appdomain.cloud/themes/marketplace_latest/css/images/arrowbelow.png";
        } else {
            myButton.value = "+";
            myButton.src =
                "https://test.developer.api-marketplace.alrajhibank.com.sa/sandbox/sites/sandbox.apic-nonpr-766d725d-portal-web-cp4i-nprd.apimp-nprd-cl01-de8fb88b0db8c47d4745b3af8ac7158d-0000.eu-de.containers.appdomain.cloud/themes/marketplace_latest/css/images/arrowup.png";
        }
    }
}

function faq2(myBtn) {
    var myButton = document.getElementById(myBtn);
    if (myButton) {
        if (myButton.value == "+") {
            myButton.value = "x";
            myButton.src =
                "https://test.developer.api-marketplace.alrajhibank.com.sa/sandbox/sites/sandbox.apic-nonpr-766d725d-portal-web-cp4i-nprd.apimp-nprd-cl01-de8fb88b0db8c47d4745b3af8ac7158d-0000.eu-de.containers.appdomain.cloud/themes/marketplace_latest/css/images/arrowbelow.png";
        } else {
            myButton.value = "+";
            myButton.src =
                "https://test.developer.api-marketplace.alrajhibank.com.sa/sandbox/sites/sandbox.apic-nonpr-766d725d-portal-web-cp4i-nprd.apimp-nprd-cl01-de8fb88b0db8c47d4745b3af8ac7158d-0000.eu-de.containers.appdomain.cloud/themes/marketplace_latest/css/images/arrowup.png";
        }
    }
}