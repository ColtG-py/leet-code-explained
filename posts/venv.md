---
title: 'Why you should use venv'
date: '2023-08-08'
chapter: '2'
tags: ['Python']
category: 'Beginner Friendly'
---

Python, by itself, is powerful. However, to unlock its full potential, one only needs to scan the various free libraries on [PyPI](https://pypi.org/ "PyPI") to see how much is possible with a sprinkling of pip packages. A few pip installs will likely work fine:
```
pip install <package> <package>
```
And you'll go on your merry way. However, weeks later, when you start working on something completely separate from that previous project, you'll again go to install packages:
```
pip install <package>
```
And you may encounter any number of issues related to conflicting dependencies. The problem is that while your code for these two projects is isolated:
```
/projects/
    awesome_project_1/
        main.py
    awesome_project_2/
        main.py
```
Your dependencies for these two are not. This is easily solvable however, using a handy tool called 'venv', which allows you to create a virtual environment to run your Python code, which can be activated or deactivated at any time. This, used in conjunction with a `requirements.txt` file, can easily allow you to share your code with others along with the dependencies necessary to run it.

### Installations

Let's get started by installing the `venv` package.
```
pip install virtualenv
```
Easy enough, we now have virtualenv on our machine. 

### Creating Virtual Environment

Now, let's create our first virtual environment. Using the previous example, I'm going to create a virtual environment for the 'awesome_project_1' project.
```
/projects/
    awesome_project_1/
        main.py
        <where_this_virtual_env_will_be>
    awesome_project_2/
        main.py
```
Make sure we are in the 'awesome_project_1 directory:
```
cd projects/awesome_project_1
```
And from here, run this command:
```
python -m venv <desired-environment-name>
```
What this does is execute the virtual environment module in this directory, creating a fresh, blank virtual environment called <desired-environment-name> (or whatever you decided to name it) for us to use. I decided to name my venv **ascii-art**, as this is the name of the project contained in this folder. If I take a look again at my directory structure:
```
/projects/
    awesome_project_1/
        main.py
        ascii-art/
            Include/
            Lib/
            Scripts/
            pyvenv.cfg
    awesome_project_2/
        main.py
```
There's a lot more going on now. It's worth mentioning, at this point, that I'm doing this on a Windows OS machine, and the contents of the ascii-art/ folder will look different on MacOS and Linux. 

### Using the Virtual Environment

We don't need to look too deeply into any of these contents, if we don't want to. The most important thing in this new ascii-art folder is the `Activate.ps1` script in the Scripts folder:
```
/projects/
    awesome_project_1/
        main.py
        ascii-art/
            Include/
            Lib/
            Scripts/
                Activate.ps1
            pyvenv.cfg
    awesome_project_2/
        main.py
```
Which I'll now run from my Powershell terminal to 'activate' my virtual environment:
```
.\ascii-art\Scripts\Activate.ps1
```
...which means I'll be using only dependencies I've installed as part of this environment now. I can test this by running a `pip list`:
```
Package    Version
---------- -------
pip        19.2.3
setuptools 41.2.0
```
Which you can see is completely blank. I can deactivate my environment at any time by simply running:
```
deactivate
```
And again, if I decide to run `pip list`:
```
Package        Version
----------     -------
art            6.0
other_packages 0.0.1
...
pip            19.2.3
setuptools     41.2.0
```
There's likely a LOT more libraries listed. This is because now, I'm targetting my machines' environment, which up until this point I've been installing all of my packages to.
Awesome, we have a way of isolating our packages on a per-project basis! I'll go back into my virtual environment again:
```
.\ascii-art\Scripts\Activate.ps1
```
And now, I'll install the package I need to run this project.
```
pip install art
```
If I run `pip list` again, I see that the art package is installed as part of this virtual environment now:
```
Package    Version
---------- -------
art        6.0
pip        19.2.3
setuptools 41.2.0
```
And now, if I add a little bit of code to the `main.py` Python script in this folder to use the art library:
```
from art import tprint

def main():
    tprint("Hello World!")

if __name__=='__main__':
    main()

```
And then run the script with `python main.py`:
```
 _   _        _  _         __        __              _      _  _
| | | |  ___ | || |  ___   \ \      / /  ___   _ __ | |  __| || |
| |_| | / _ \| || | / _ \   \ \ /\ / /  / _ \ | '__|| | / _` || |
|  _  ||  __/| || || (_) |   \ V  V /  | (_) || |   | || (_| ||_|
|_| |_| \___||_||_| \___/     \_/\_/    \___/ |_|   |_| \__,_|(_)

```
I get some lovely ASCII art print to my console, using my virtual environment!

### Packaging Virtual Environment

You now know how to use virtual environment to handle your packages in Python. But how do I share my environment with others? It's not best practice to share your environment directly, as it can have dependencies tied to your OS, and can easily break if versions of packages change. Instead, it's best to use a `requirements.txt` file to share dependencies with others. 

To create this is very simple. From the directory of your project, **with the virtual environment activated**, run:
```
pip freeze > requirements.txt
```
Which will create a new file called `requirements.txt`. Opening this file, you'll see a handy list of all requirements this project (and by proxy, this virtual environment runtime) needs to be executed.
```
requirements.txt:
-----------------
art==6.0
```
Pretty simple! Now, assuming you are committing your code to a git repository (which you should be) best practice would be to add the venv folder to your .gitignore:
```
/projects/
    .git/
    .gitignore
    awesome_project_1/
        main.py
        requirements.txt
        ascii-art/
            Include/
            Lib/
            Scripts/
                Activate.ps1
            pyvenv.cfg
    awesome_project_2/
        main.py

.gitignore:
-----------------------------
#envs
/awesome_project_1/ascii-art
```
As to avoid confusion. And then, simply commit your requirement.txt file and allow other users to install the requirements as such:
```
pip install -r requirements.txt
```
Again, from **their own virtual environment they've created**. That's the power of virtual environments! 

### Project Sample Code
I've provided some sample code in this [repository](https://github.com/ColtG-py/leet-code-explained/tree/master/sample-code/3-venv "repo") which contains the project I described above. You'll still need to create the virtual environment, but you should have all the knowledge you need to do this now.

Thanks,

-- Colt

### Sources

A full breakdown of resources I used in sourcing this material:
* [Python's docs on venv](https://docs.python.org/3/library/venv.html "venv")
* [Python art's pypi](https://pypi.org/project/art/ "venv")
* [Article on why not to store venv in git](https://stackoverflow.com/questions/6590688/is-it-bad-to-have-my-virtualenv-directory-inside-my-git-repository "SO")