# General Editorial Guidelines

## General Guidelines

**The “Meeting Talk” Litmus Test**
“Will this sound competent if read aloud in a technical meeting?” is *the* litmus test for all content.

Imagine a user read an Insight you wrote and repeats it *verbatim* in a meeting the following day or following week.  Will it seem strange to the people in the meeting?  Will it sound fluent?  Will the other participants look at the person and ask, “I understand what you’re saying, but where did they learn to say it like *that*?”

“Write the way you speak” is one of the first pieces of advice every writer receives.  When writing educational content you also want to write the way you wish your *students* would speak.

**Optimize for Google-ability**
Since Insights can be ordered in many different ways, it is hard to know how much prior knowledge to assume. When in doubt, optimize for Google-ability by emphasizing certain keywords related to the topic. Test those keywords out yourself to make sure they would lead the user to the right information.

Some examples:

- If you're using an acronym, expand the acronym the first time you use it, e.g., "PSA (short for 'Plesk Server Application')" or "RPM (formerly 'RedHat Package Manager')"
- If you use a piece of jargon, make sure the plain-English definition contains enough of the correct keywords.
- Unix-land is filled with two-letter commands. Spell out what they mean when you first introduce them, e.g., "the `cd` command, short for **c**hange **d**irectory, allows the user to..."

**Use** `**code**` **for things that a user might actually type on a computer, whether part or all of a command or piece of code, and** ***only*** **use it for that.**

When referring to the program or overall system that is “iptables”, write iptables without code formatting.  When referring to the command a user might run, write `iptables` with code formatting.  Likewise, when referring to the number five in general write “5” but when referring to the integer literal in a specific programming language write `5` .

Here is an example paragraph:

On Linux, the general firewall system is called *iptables* (pronounced “eye-pee tables”).  You can use the  `iptables` command to list add, remove, modify, and view the current firewall rules. You will generally have to run `iptables` with `sudo` to modify the firewall rules, but you may or may not need `sudo` to list them.

Regardless, run this to see iptables’ current filtering rules:


    $ sudo iptables -L -n

(You would include example output here and also explain what the `-L` and `-n` command-line arguments do.)


## Writing Useful Examples

Good examples should be clear, runnable as written, realistic, and contain the fewest number of "features" necessary to illustrate the point. Everything in an example should be explained by surrounding text.

An example that uses 4 command-line arguments and requires Debian to illustrate its point is *strictly inferior* to an example that illustrates the same point using 1 command-line argument and works on every Unix-like OS.

**Start with the simplest example possible**
If you want to explain what `ls` does then start with just `ls` as an example, not something like `ls -lh`. More "interesting" examples can come later.

Note that this does not mean the first example should *never* include command-line arguments. For example, running `ps` alone is relatively rare compared to something like `ps aux` (and the output much less useful). Similarly, you'd never use a command like `watch` without *some* arguments.
Ask yourself, "Could I illustrate the same point with a simpler example?" If the answer is "yes" take the time to refine it!

## Key Information

**Always answer "why?"**
The short-form and mobile nature of Enki means that people will forget details when it comes time to sit down at their computer. However, if they can remember the *why* they'll be able to reconstruct the details themselves. The *why* is one of the main ways people remember.

Answers like "Because this is a best practice" or "Because it's recommended" are not satisfactory to a user. They sound like an adult telling a child to clean their room "Because I said so" — it's never convincing.

A good way to "explain why" is to present the user with a problem this Insight would solve.

**Highlight main use cases / problems an Insight solves**
Users remember problems, not solutions. They remember being frustrated, not the feeling of relief that comes after.

An Insight about "How to do X" that includes a single command, a small amount of supporting text, and nothing else leaves most users asking "Ok. So what?" The exception is when a user was recently asking themselves "How do I do X?", in which case the Insight will make perfect sense.

For most users this isn't the case and they have yet to encounter the problems an Insight is meant to address.

**Explain the command-line switches and arguments used in each example**
If you use a command-line switch or argument in an example then make sure to explain it with supporting text. A user should never have to ask "What does `-x10` do?"

**Always include example output**
Include example output for the main examples in an Insight. A user should never have to ask "What can I expect the output of `some_command -z20` to look like?" or “What does this block of code display when run?”

Users ask this because they're not sure whether what they're doing is correctly and want to feel sure they're on the right track.

**Always include example text when instructing users to edit a file**
If an Insight asks a user to find or edit a specific file, include an example of what the file would look like in the editor. Again, this helps users confirm for themselves that they're on the right track.



