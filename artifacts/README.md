EcoLearnia interactives
=======================

# Running the Demo
There are two types of demo (test), one that runs locally, and another that
requires server (EcoLearnia-server).

## Running the local Demo
Even with the local demo, it requires to run a local web server so the script in
the page can fetch the JSON content definition.

1. Run the browsersync: `$browser-sync start --server` in the project root
directory.
2. Launch a browser and open the url `http://localhost:3000/artifacts/samples/sample-interactives3.html`

## Running the end-to-end Demo
As of July 2016, the end-to-end is still not a full LMS, but just the
assessment rendition and interaction integration.

To run the end-to-end demo:
1. Run the mysql server (in my computer, I can execute `$run.sh mysqld`).
2. Run the ecolearnia-server-php server. Go the the server project and run
`php artisan serve`.
3. Run the browsersync: `$browser-sync start --server` in the project root
directory. This is needed as the demo assignment page is served from a local
page in this project.
2. Launch a browser and open the url `http://localhost:3000/artifacts/samples/sample-assginment1.html`
