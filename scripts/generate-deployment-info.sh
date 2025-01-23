# This is a script gotten from https://gist.github.com/textarcana/1306223, but
# modified a bit so it only shows the last commit.
git log -1 --pretty=format:'{%n  "commit": "%H",%n  "author": "%aN <%aE>",%n  "date": "%ad",%n  "message": "%s"%n}'