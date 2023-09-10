---
title: 'Managing dev dependencies with Poetry'
date: '2023-09-10'
chapter: '3'
tags: ['Package Management']
category: 'Beginner Friendly'
---

### Dependency Management in Python

Python has a number of wonderful aspects (expansive package ecosystem, beginner friendly syntax), but not among these items is it's native package management. Raise your hand if you've pulled your hair out configuring Tensorflow and CUDA. Or wanted to throw your computer out a window when Twisted fails to install correctly. These are not bright spots in the Python world. So what, exactly, are my options for managing these dependencies such that they don't blow up in inexplicable ways consistently?

#### Requirements.txt
First, the native solution. Create a virtual environment, install pip dependencies to this virtual environment, and then:

```
pip freeze > requirements.txt
```

To get a list of packages that you can then install anywhere like so:
```
pip install -r requirements.txt
```
Not bad. But what if I've got development specific dependencies that I don't want to be installed to my production containers? You can manage separate requirements.txt files, but this complicates the process of managing them (Who owns the development version of the requirements.txt? Who owns the production version?) and can lead to headaches with dependency management down the road. To avoid these pitfalls, I'd suggest trying out poetry, as it ships with features to support development specific dependencies.

### What is Poetry?

In a few sentences, Poetry is a modern dependency management solution for python which solves a couple of common scenarios teams often run into, like the aforementioned development dependencies scenario, which will be the focus of this article.

#### Installation
To install poetry, follow guidance here: https://python-poetry.org/docs/#installing-with-pipx

#### Usage
Poetry is easy enough to configure with any project. Start by simply initializing the project with this command:
```
poetry add <project_name>
```
Now, you'll notice a folder titled whatever you named the environment which contains a directory structure like the following:
```
/projects/
    awesome_project_1/
        awesome_project_1/
        tests/
        pyproject.toml
        README.rst

```
**Note:** You can initialize an existing directory by cd'ing into it and running poetry init:
```
cd my_dir_name && poetry init
```
Straight forward enough. Code goes in the `awesome_project_1` folder, tests go inside the `tests` folder, and the configuration for your project is managed within the `pyproject.toml` file. Let's add some dependencies and see what changes within this `pyproject.toml` file. First, let's activate our shell within this project:

```
poetry shell
```
Which instantiates our virtual environment. Now, let's add any package:
```
poetry add art
```
And take a look at the updated `pyproject.toml` file.
```
[tool.poetry]
name = "awesome_project_1"
version = "0.1.0"
description = ""
authors = ["Your Name <you@example.com>"]

[tool.poetry.dependencies]
python = "^3.10"
art = "^6.0"

[build-system]
requires = ["poetry-core>=1.0.0"]
build-backend = "poetry.core.masonry.api"
```
Easy enough, there's the art dependency we added. What if I have a development specific package that I want to install? That's easily achieved like so:
```
poetry add --dev requests
```
And now taking a look at our `pyproject.toml` file again:
```
[tool.poetry]
name = "sample_project"
version = "0.1.0"
description = ""
authors = ["Your Name <you@example.com>"]

[tool.poetry.dependencies]
python = "^3.10"
art = "^6.0"

[tool.poetry.dev-dependencies]
pytest = "^5.2"
requests = "^2.31.0"

[build-system]
requires = ["poetry-core>=1.0.0"]
build-backend = "poetry.core.masonry.api"
```
There's the dependency, under the `[tool.poetry.dev-dependencies]` header.

Now, let's say we are managing development of a docker image, and want some packages to be installed specifically for developers but not for the production image. For developers, they could checkout the code and simply run:
```
poetry shell && poetry install
```
To both activate the shell and install **all packages**, including development packages. For the docker image, this installation would instead look like this:
```
poetry install --no-dev
```
Simply meaning that we want to install everything except the development packages.

You may have noticed a file appear titled `poetry.lock`; this is a file poetry's dependency resolver generates which indicates the versions of packages it chose to satisfy the constraints of your projects' packages. This is exceptionally handy for figuring out issues with dependency installation. A quick tip to more easily see this output:
```
poetry show
```
Will give the exact installed versions of each package in your project. For instance, my sample project looks like the following:
```
art                6.0       ASCII Art Library For Python
attrs              23.1.0    Classes Without Boilerplate
certifi            2023.7.22 Python package for providing Mozilla's CA Bundle.
charset-normalizer 3.2.0     The Real First Universal Charset Detector. Open, modern and actively maintained alternative to Chardet.
idna               3.4       Internationalized Domain Names in Applications (IDNA)
more-itertools     10.1.0    More routines for operating on iterables, beyond itertools
packaging          23.1      Core utilities for Python packages
pluggy             0.13.1    plugin and hook calling mechanisms for python
py                 1.11.0    library with cross-python path, ini-parsing, io, code, log facilities
pytest             5.4.3     pytest: simple powerful testing with Python
requests           2.31.0    Python HTTP for Humans.
urllib3            2.0.4     HTTP library with thread-safe connection pooling, file post, and more.
wcwidth            0.2.6     Measures the displayed width of unicode strings in a terminal
```
Sweet! Now, we can manage dependencies for both our production images and our development images using the same configuration but with flags. Additionally, we can easily see the status of dependencies in our project, helping us troubleshoot any issues with packages. Poetry solves a number of issues with Python's native package management, and has many use cases far beyond the scope of this relatively simple article. I'd encourage you to explore their documents here: https://python-poetry.org/docs/