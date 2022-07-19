import setuptools

with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name="ca-sample-flask-app",
    version="1.0.0",
    author="Askar",
    author_email="askar.k.serikov@gmail.com",
    description="A sample Flask web app",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/askarserikov/flask-app",
    packages=setuptools.find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
)