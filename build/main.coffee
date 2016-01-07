app = require('app')# Module to control application life.
shell = require('shell')# for external url navigation
BrowserWindow = require('browser-window')# Module to create native browser window.
fs = require('fs')# file system

# Reports crashes to the Electron server
# do we need this?
require('crash-reporter').start()

# open up the source code for the chrome extension
extractCss = extractJs = controllerJs = encircle_shimJs = ''
fs.readFile(__dirname + '/extract.css', 'utf8', (err, data) ->
    if err then return console.log(err)
    extractCss = data
)
fs.readFile(__dirname + '/extract.js', 'utf8', (err, data) ->
    if err then return console.log(err)
    extractJs = data
)
fs.readFile(__dirname + '/controller.js', 'utf8', (err, data) ->
    if err then return console.log(err)
    controllerJs = data
)
fs.readFile(__dirname + '/encircle_shim.js', 'utf8', (err, data) ->
    if err then return console.log(err)
    encircle_shimJs = data
)

app.on('window-all-closed', () -> if process.platform != 'darwin' then app.quit()) # Quit when all windows are closed.

# Keep a global reference of the window object, if you don't, the window will
# be closed automatically when the javascript object is GCed
mainWindow = pricingWindow = null

app.on('ready', () ->
    mainWindow = new BrowserWindow({
        'node-integration': false, #disable integration of node.js since we are working online (causes major errors if enabled)
        icon: __dirname + 'icon.png', # doesn't seem to work, nor does setting the icon in package.json
        'auto-hide-menu-bar': true
    })

    # load the main page
    mainWindow.maximize()
    # mainWindow.loadUrl('file://' + __dirname + '/index.html')
    # mainWindow.loadUrl('http://localhost:8888/claims')
    mainWindow.loadUrl('https://encircleapp.com/claims')
    mainWindow.setTitle('Encircle Claims')
    mainWindow.on('page-title-updated', (event)-> event.preventDefault())
    mainWindow.openDevTools()

    mainWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl, isMainFrame) ->
        if newUrl.indexOf('localhost:8888') == -1 and newUrl.indexOf('encircleapp.com') == -1
            event.preventDefault()
            shell.openExternal(url)
        else if newUrl.indexOf('mailto') != -1 then event.preventDefault()
    )

    mainWindow.webContents.on('will-navigate', (event, url) ->
        if url.indexOf('localhost:8888') == -1 and url.indexOf('encircleapp.com') == -1
            event.preventDefault()
            shell.openExternal(url)
        else if newUrl.indexOf('mailto') != -1 then event.preventDefault()
    )

    # this should only ever fire when the user clicks on 'find replacement'
    mainWindow.webContents.on('new-window', (event, url, frameName, disposition) ->
        if url.indexOf("localhost:8888") == -1 and url.indexOf("encircleapp.com") == -1
            event.preventDefault()
            pricingWindow = new BrowserWindow({
                title: "Pricing Search",
                'auto-hide-menu-bar': true
            })
            pricingWindow.maximize()
            pricingWindow.loadUrl(url)
            pricingWindow.setTitle('Pricing Search')
            pricingWindow.on('page-title-updated', (event)-> event.preventDefault())
            pricingWindow.openDevTools()

            # currently this will raise a type error with the .insertCSS() when you open a pricing search window
            # since the javascript files currently don't work properly the html is not created, and so there is nothing for the css to act on
            # this should fix itself once the js works properly
            pricingWindow.webContents.on('did-finish-load', () ->
                pricingWindow.webContents.executeJavaScript(controllerJs)
                pricingWindow.webContents.executeJavaScript(encircle_shimJs)
                pricingWindow.webContents.executeJavaScript(extractJs)
                pricingWindow.webContents.insertCSS(extractCss)
            )
        else if url.indexOf('mailto') != -1 then event.preventDefault()
    )

    # Dereference the window object once the window is closed
    mainWindow.on('closed', () -> mainWindow = null)
)
