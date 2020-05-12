let puppeteer = require("puppeteer");
let movieName = process.argv[2];

(async function () {
  try {
    let browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ["--start-maximized"],
    });
    let pages = await browser.pages();
    let page = pages[0];
    await page.goto("https://www.imdb.com", { waitUntil: "networkidle2" });
    await page.waitForSelector("input[type=text]");
    await page.type("input[type=text]", movieName);
    let search = await page.waitForSelector("#suggestion-search-button");
    await Promise.all(
      [page.click("#suggestion-search-button")],
      page.waitForNavigation({ waitUntil: "networkidle2" })
    );
    let searchedMovies = await page.waitForSelector(
      ".findSection table tbody tr"
      );
    await Promise.all(
      [page.click(".findSection table tbody tr td a")],
      page.waitForNavigation({ waitUntil: "networkidle0" })
    );
    
    await page.waitForSelector('.title_wrapper h1',{visible:true})
    let elem1 = await page.$('.title_wrapper h1');
    let movieData=await page.evaluate(function(el)
    {
      console.log("Entering fn")
      let title= el.textContent;
      return title;
    },elem1)
    console.log("Name of Movie:  "+movieData)
    let elem2=await page.$('.imdbRating .ratingValue span');
    let ratingData=await page.evaluate(function(el){
      let rating=el.textContent;
      return rating
    },elem2)
    console.log("Ratings of Movie:  "+ratingData)
    await page.waitForSelector('.plot_summary_wrapper .plot_summary .credit_summary_item a');
    let elem3=await page.$('.plot_summary_wrapper .plot_summary .credit_summary_item a');
    let dirName=await page.evaluate(function(el){
      let director=el.textContent;
      return director;
    },elem3);
    // let elem4=await page.$$('#titleDetails .txt-block')
    // let releaseDate=await page.evaluate(function(el){
    //   return el.textContent;
    // },elem4[3])
    // console.log(releaseDate);
    console.log("Director Name:  "+dirName)
    let elem5=await page.$('.plot_summary_wrapper .plot_summary .summary_text');
    let summary=await page.evaluate(function(el){
      let summaryMovie=el.textContent;
      return summaryMovie;
    },elem5);
    console.log("Summary of Movie:  "+summary);
  } catch (err) {
    console.log(err);
  }
})();
