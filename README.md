![alt text](https://i.imgur.com/KyvVIUf.png)



#### 1. Install dependencies 

This project require nanomsg,

##### linux:

```shell
sudo apt-get update
sudo apt-get install build-essential git cmake libcurl4-openssl-dev

git clone https://github.com/nanomsg/nanomsg
cd nanomsg
cmake . -DNN_TESTS=OFF -DNN_ENABLE_DOC=OFF
make -j4
sudo make install
sudo ldconfig
```

#### 2. Download and install the packages [Release page](https://github.com/dsslimshaddy/barter-dex/releases)



### Themes
You need to create a `theme.json` file in `$HOME/.barterdex/`.
Use [this](https://gist.github.com/dsslimshaddy/183d1220d79072403e2f4c1bcb366f61) as guide.
[Color Pallete Creator](http://mcg.mbitson.com/#!?mcgpalette0=%236b80c5)

