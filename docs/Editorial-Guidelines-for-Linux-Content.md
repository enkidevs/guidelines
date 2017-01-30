
# Editorial Guidelines for Linux Content

These are a first pass at some basic editorial guidelines for Linux content based on what I saw after looking over all the Insights.

## Writing Useful Examples

Good examples should be clear, runnable as written, realistic, and contain the fewest number of "features" necessary to illustrate the point. Everything in an example should be explained by surrounding text.

An example that uses 4 command-line arguments and requires Debian to illustrate its point is *strictly inferior* to an example that illustrates the same point using 1 command-line argument and works on every Unix-like OS.

**Avoid distribution-specific commands**
A small number of Insights are necessarily distribution-specific, e.g., an Insight describing a feature of `apt-get`. For the majority that aren't, avoid examples that instruct the user to use a distribution-specific command.

**Bad** (assumes Debian)

An example of `&&` :

    $ apt-get update && apt-get install apache

**Good** (assumes `bash`)

An example of `&&` :

    $ mkdir fancy_dir && cd fancy_dir

**Avoid distribution-specific directories and files**
Unless an Insight is specifically about "How to do X on Debian" or "How to do X on RedHat", avoid directing users to specific directories or files that vary from distribution to distribution.
If the Insight requires editing a file then give instructions in a distribution-agnostic way, possibly including one or two distribution-specific examples.

**Bad** (assumes RedHat)
Apache's main configuration file is called `httpd.conf` and can be located at `/etc/httpd/conf/httpd.conf`.

**Good**
Apache's main configuration file is often called `httpd.conf`, `apache.conf`, `apache2.conf`, or similar. The name and location of this file vary from platform to platform and version to version. On recent Debian-based platforms it is located at `/etc/apache2/apache2.conf` and on recent RedHat-based platforms it is located at `/etc/httpd/conf/httpd.conf`. Note that these locations might be different on older versions of these platforms, too!

Regardless of platform, you can find the location yourself with the `httpd -V` command. ([Include generic instructions here](http://stackoverflow.com/questions/12202021/where-is-my-httpd-conf-file-located-apache).)

**Start with the simplest example possible**
If you want to explain what `ls` does then start with just `ls` as an example, not something like `ls -lh`. More "interesting" examples can come later.

Note that this does not mean the first example should *never* include command-line arguments. For example, running `ps` alone is relatively rare compared to something like `ps aux` (and the output much less useful). Similarly, you'd never use a command like `watch` without *some* arguments.
Ask yourself, "Could I illustrate the same point with a simpler example?" If the answer is "yes" take the time to refine it!

**Avoid superfluous command-line switches and arguments**
Avoid using command-line switches and arguments that aren't essential to whatever point the example is meant to illustrate. Any time a user sees a command-line argument they aren't familiar with they'll ask "What does `-x10` do?" and be left worried that they didn't fully understand the Insight. (`-x10` is a hypothetical "dummy" command-line argument.)

The easiest solution is to avoid using `-x10` in the first place. If it can't be omitted or the example can't be reworked to avoid it then make sure to include an explanation of what `-x10` does.

**Avoid OS-specific command-line switches and arguments**
Ideally, every example would be runnable on any Unix-like OS, including Mac OS X. However, on Linux many core commands like `ls`, `ps`, `man`, etc. are provided by [GNU Coreutils](http://www.gnu.org/software/coreutils/coreutils.html) and have GNU-only command-line switches and arguments which differ from their BSD counterparts.

**Bad** (uses Linux-only argument)

    $ apropos -s8 "user*"

**Good**

    $ apropos "user*"

The `-s` switch is GNU-specific, so unless the `-s8` switch is essential to the example, it can be safely omitted. Not only does this make the example more portable but it makes for one fewer thing to explain (i.e., what `-s8` does).

## Key Information

**Explain the command-line switches and arguments used in each example**
If you use a command-line switch or argument in an example then make sure to explain it with supporting text. A user should never have to ask "What does `-x10` do?"

