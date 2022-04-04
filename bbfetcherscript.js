var listOfTerritories = [
  {
    pathDef:
      "m 46.212944,58.64637 c 3.873263,-2.725174 7.93274,-5.176518 2.813599,-8.111815 -1.78219,-3.872556 -3.917484,6.512586 -8.559206,3.278582 -6.381344,-0.688794 -18.195105,-7.22379 -20.589889,1.181114 4.899579,6.62688 17.682908,1.078746 25.350463,5.168087 0.41279,-0.476066 0.819945,-0.888522 0.985033,-1.515968 z",
    name: "NorthWesternTerritory",
  },
  {
    pathDef:
      "m 165.6789,59.945158 c 4.1655,-3.862445 13.89935,-4.089157 10.94173,-10.250676 1.17547,-8.141201 -8.06172,0.337128 -11.89231,-3.680885 2.56269,5.537918 -5.70041,8.053658 -0.91539,12.83975 -0.10248,1.25336 1.27511,3.767565 1.86597,1.091811 z",
    name: "Yakutsk",
  },
  {
    pathDef:
      "M 71.610403,61.390004 C 74.547802,55.21719 84.329832,52.897793 82.154576,44.476717 79.159243,37.567029 68.675442,39.947298 63.03288,44.667962 c -6.833337,2.940943 -1.724374,4.563561 2.627381,5.788733 2.308022,2.018531 0.238718,18.167671 5.950142,10.933309 z",
    name: "Greenland",
  },
  {
    pathDef:
      "m 94.837682,62.760829 c -3.091477,-4.591774 -14.042934,0.299601 -5.516279,2.905939 2.091909,-0.37565 3.803677,-1.749783 5.516279,-2.905939 z",
    name: "Iceland",
  },
  {
    pathDef:
      "m 22.863859,66.387721 c -1.402911,-5.238975 -5.84554,-9.105887 -4.106563,-14.940073 -4.755557,-6.383753 -13.4983341,0.918508 -11.9905499,5.015885 -5.4061986,2.725367 3.1164766,7.600178 6.2587769,3.925311 4.10512,-0.229273 7.82848,2.605928 9.838336,5.998877 z",
    name: "Alaska",
  },
  {
    pathDef:
      "m 106.58424,69.423346 c -1.95415,-5.026826 5.71007,-13.533354 5.04234,-4.188018 6.29867,-2.035623 0.95911,-17.016474 -5.74395,-8.493366 -7.451667,3.137314 -10.258903,14.338904 0.2835,14.081124 l 0.34325,-0.544439 z",
    name: "Scandinavia",
  },
  {
    pathDef:
      "m 38.802155,68.911121 c 3.770182,-8.489527 -3.186956,-9.981231 -9.829281,-9.254984 -9.037523,-1.53902 -4.582541,8.411708 -3.453046,12.968151 3.39455,1.894941 7.830936,0.452202 11.733471,0.899132 2.650349,0.772479 0.831686,-3.273251 1.548856,-4.612299 z",
    name: "Alberta",
  },
  {
    pathDef:
      "m 169.72586,75.546907 c 0.33412,-7.495109 8.45874,-2.271067 8.45127,-2.105907 -2.20692,-4.805062 -9.1555,-8.182698 -8.58567,-13.238164 -6.15539,-0.01819 -3.90836,11.151243 -10.31848,9.631533 -3.09471,9.229876 5.50206,5.613396 10.45288,5.712538 z",
    name: "Irkutsk",
  },
  {
    pathDef:
      "m 51.338561,71.33295 c -2.049613,-2.96361 -9.822975,-9.74672 -9.763285,-8.752444 -1.7124,5.442398 -2.812136,13.209962 5.427021,11.234804 3.893259,2.772856 5.840323,2.964187 4.336264,-2.48236 z",
    name: "Ontario",
  },
  {
    pathDef:
      "m 58.660042,76.844382 c 2.782633,-2.607646 11.706772,-5.478605 6.045223,-10.468566 -3.48857,-0.817613 -4.343858,-2.369817 -6.734713,-4.219071 -2.775288,2.6767 -8.471739,20.144454 0.68949,14.687637 z",
    name: "Quebec",
  },
  {
    pathDef:
      "m 182.4035,77.921193 c 4.80716,-7.566678 -12.63095,-14.032866 -0.82408,-17.923155 5.17548,-1.899163 8.38059,-4.449249 6.85747,2.793603 -1.042,4.048405 2.50635,8.825756 0.92739,1.809447 -0.26057,-4.955285 3.55037,-9.433075 4.59181,-12.154391 7.74607,1.048751 -5.56211,-5.836005 -8.62603,-4.768556 -5.68684,-1.342968 -8.06117,3.449533 -6.52373,7.48588 -11.16058,0.999151 -5.86313,12.500714 0.73624,15.994637 1.94425,1.337355 -0.95795,10.625438 2.86093,6.762535 z",
    name: "Kamchatka",
  },
  {
    pathDef:
      "m 188.74998,79.990266 c -0.27104,-5.859507 -0.47152,-23.436392 -9.31394,-16.214103 6.56762,3.671805 2.36477,13.810664 9.31394,16.214103 z",
    name: "Japan",
  },
  {
    pathDef:
      "m 158.97204,79.315608 c -4.09664,-4.998912 -1.45325,-12.801523 4.15771,-13.137811 0.73019,-5.914193 -6.10913,-12.658322 0.66738,-16.44589 0.89836,-5.698927 -8.41522,-3.985036 -7.33247,-4.408119 -1.56375,-7.857293 -15.5512,1.286421 -12.79882,7.077199 4.95416,5.379742 6.48606,14.503046 9.32576,21.317328 1.0798,1.028809 5.53578,8.484907 5.98044,5.597293 z",
    name: "Siberia",
  },
  {
    pathDef:
      "m 152.89227,78.673455 c -0.14082,-4.745331 -5.89615,-7.574457 -4.17565,-12.413212 -0.73837,-6.233868 -6.72636,-14.558386 -10.33434,-5.040175 -1.6809,8.394394 5.28709,20.605888 14.10281,19.128844 z",
    name: "Ural",
  },
  {
    pathDef:
      "M 91.400416,83.734834 C 90.498269,80.392318 85.839284,71.37361 84.906922,71.597741 c 1.778178,4.511922 1.674008,8.549275 2.889201,12.456738 1.157216,0.555878 2.503237,0.130882 3.604293,-0.319645 z",
    name: "GreatBritain",
  },
  {
    pathDef:
      "m 109.50894,87.785311 c 6.99632,-6.063955 1.62375,-18.799837 -7.36451,-10.951654 -5.793627,3.735915 -6.238831,13.966942 3.01365,10.281574 3.36447,-4.678608 3.44582,3.262357 4.35086,0.67008 z",
    name: "NorthernEurope",
  },
  {
    pathDef:
      "m 176.26316,88.679896 c -0.14314,-4.152318 8.7702,-6.50169 1.48815,-11.609298 -1.48832,-3.662389 -6.49721,-5.725657 -5.58444,0.09976 -6.62063,-2.129654 -16.1487,1.831476 -9.10358,8.921229 3.78992,2.63511 8.747,2.807913 13.19987,2.588314 z",
    name: "Mongolia",
  },

  {
    pathDef:
      "m 36.351478,90.277716 c 2.424993,-4.228155 10.890717,-10.913446 4.090497,-15.266286 -4.733733,0.428655 -9.52701,0.149061 -14.290124,0.228194 -2.696892,5.816385 -2.796373,15.141173 5.614969,13.172468 1.326001,0.581018 3.027267,3.863796 4.584658,1.865624 z",
    name: "WesternUS",
  },

  {
    pathDef:
      "m 39.086904,93.933424 c 7.726954,-0.918491 16.446291,-0.651321 18.478581,-10.080274 3.043875,-3.224141 3.32052,-8.084881 -1.57309,-3.443801 -3.912551,2.710382 -11.125926,1.705417 -11.243071,-4.028251 3.735055,6.613994 -11.436878,15.4359 -5.66242,17.552326 z",
    name: "EasternUS",
  },

  {
    pathDef:
      "m 130.5235,94.910321 c -0.30076,-7.400928 -5.37857,-19.455038 6.33431,-20.224131 2.09557,-6.069799 -1.04381,-14.240123 -0.71398,-19.892724 -7.81111,-3.659037 -14.35757,9.00229 -20.33749,4.839659 0.41939,7.590696 -4.74473,14.297403 -1.7257,21.55285 -2.05172,7.931193 8.74547,8.93412 10.35852,8.028045 -0.10095,2.812157 2.81141,7.550267 6.08434,5.696301 z",
    name: "Ukraine",
  },

  {
    pathDef:
      "m 142.96221,95.753374 c 4.43057,-1.135138 6.61888,-2.633808 5.95981,-6.746015 4.74416,-6.480999 -5.89008,-11.204001 -10.35884,-13.03892 -4.42101,-0.786666 -11.64707,6.135692 -4.40652,7.9383 -0.33542,3.930045 3.72603,15.008263 8.80555,11.846635 z",
    name: "Afghanistan",
  },

  {
    pathDef:
      "m 111.16731,101.16242 c 2.878,-3.014411 5.40104,-15.976664 0.47221,-12.528239 -2.9356,4.189257 -11.33298,-4.808669 -11.63696,4.316611 0.10479,4.280292 7.22011,9.656308 4.71149,2.20316 4.16889,-2.916238 7.32488,13.259658 6.45326,6.008468 z",
    name: "SouthernEurope",
  },

  {
    pathDef:
      "m 93.569746,102.75403 c -1.297866,-5.210794 9.931934,-14.102639 0.535712,-15.343237 -8.087696,1.24249 0.404564,9.005151 -7.668711,9.956195 -6.170204,3.919242 4.402478,12.686472 7.132999,5.387042 z",
    name: "WesternEurope",
  },

  {
    pathDef:
      "m 177.93464,105.38076 c 7.71583,-8.800222 -4.06967,-18.58706 -13.07608,-15.933489 -4.18041,-2.497756 -10.84068,-15.541319 -12.64964,-3.939424 -4.5786,6.262345 1.78779,9.394522 4.38625,14.35411 7.07212,2.204623 15.8118,6.897633 21.33947,5.518803 z",
    name: "China",
  },

  {
    pathDef:
      "m 40.791662,106.93605 c 0.89298,-4.48245 0.777085,-5.90408 -3.659718,-5.8399 1.068055,-5.179719 -6.208398,-15.200842 -10.273053,-9.127256 2.762353,6.148351 7.824285,11.901936 13.932771,14.967156 z",
    name: "CentralAmerica",
  },

  {
    pathDef:
      "m 120.13458,118.59573 c 7.17658,-4.77663 -4.57078,-12.48155 -9.49243,-8.85874 -8.32993,-0.54133 -2.85356,10.4751 2.73023,9.07611 1.92026,1.83443 4.77928,0.9345 6.7622,-0.21737 z",
    name: "Egypt",
  },

  {
    pathDef:
      "m 50.207156,118.53503 c 3.371051,-7.47418 10.804877,-0.70242 14.229061,-4.03371 -5.729106,-4.25074 -19.432677,-8.99352 -21.089464,0.26434 -0.645623,3.06589 5.491193,7.53996 6.860403,3.76937 z",
    name: "Venezuela",
  },
  {
    pathDef:
      "m 172.11215,121.68438 c -3.77594,-6.07932 2.92514,-4.18098 3.88682,-2.44544 0.89262,-4.07893 -3.14844,-11.10282 -4.79955,-12.61132 -8.29343,-3.92336 -8.16097,5.29425 -3.29368,9.21372 0.93753,0.97321 3.93444,7.37513 4.20641,5.84304 z",
    name: "Siam",
  },

  {
    pathDef:
      "m 156.65917,121.25532 c -2.59349,-6.38724 11.85764,-16.39456 3.2929,-17.76163 -7.11759,-1.35047 -7.63231,-12.958064 -15.18342,-6.306977 -6.51236,6.757847 6.85188,12.032017 8.0587,18.560527 -0.82784,1.95831 4.00198,13.86068 3.83182,5.50808 z",
    name: "Hindustan",
  },

  {
    pathDef:
      "m 137.85248,122.5949 c 6.04352,-3.21578 3.50029,-10.32744 -1.95083,-11.3057 -3.8183,-5.65898 2.38837,-4.59579 4.78349,-2.18513 6.0298,-4.52645 -1.53903,-15.693676 -8.13005,-11.411405 -5.0841,0.647841 -19.07967,-4.166671 -16.98194,3.665855 4.78709,2.75053 9.28873,1.30025 8.52473,8.34549 2.20628,4.88608 6.71664,16.52503 13.38745,13.07824 l 0.36715,-0.18731 z",
    name: "MiddleEast",
  },

  {
    pathDef:
      "m 198.28932,133.67302 c -0.0882,-5.64895 -12.8308,-10.02443 -10.37044,-4.49237 2.11315,5.36966 7.37794,4.34124 10.80823,5.29806 z",
    name: "NewGuinea",
  },

  {
    pathDef:
      "m 109.68091,134.60878 c 0.11978,-4.65644 9.63674,-9.68285 2.29307,-14.4492 -6.79869,-1.35161 -9.99126,-6.311 -7.44337,-12.7548 -7.697472,-4.5367 -17.476,4.13647 -16.577602,12.82371 -1.367524,8.21388 5.092932,13.49038 12.459422,11.3982 3.17498,0.73964 5.91993,2.93774 9.26848,2.98209 z",
    name: "NorthAfrica",
  },

  {
    pathDef:
      "m 172.05041,140.79862 c 0.19999,-4.62612 9.27364,-3.83483 5.88437,-10.73121 -5.07993,-5.21175 -4.87009,14.54073 -8.91075,3.48179 -2.94311,-4.91859 -6.77264,-2.6277 -2.12834,1.63834 1.26167,2.08921 2.26834,5.36791 5.15472,5.61108 z",
    name: "Indonesia",
  },

  {
    pathDef:
      "m 62.544715,138.37712 c -3.914869,-7.36724 -10.67786,-13.27615 -17.175923,-18.20393 -9.918804,-0.0726 1.826769,13.1742 6.692809,14.96589 3.193539,1.28325 9.659835,3.98563 10.76776,4.73032 z",
    name: "Peru",
  },

  {
    pathDef:
      "m 67.364416,143.4839 c 1.56752,-6.66754 10.839159,-8.60526 10.549148,-16.08833 4.472764,-8.69428 -11.766368,-7.05565 -13.057662,-10.77251 -5.085959,3.81755 -13.177952,-4.19784 -13.091531,5.47333 5.685402,7.28489 14.148936,12.72153 14.245832,22.96535 0.593433,-0.39767 0.933227,-1.02223 1.354213,-1.57784 z",
    name: "Brazil",
  },

  {
    pathDef:
      "m 119.64851,146.73647 c 0.94357,-6.00168 6.09832,-14.56474 -3.73102,-15.99788 -5.3393,0.35338 -4.75363,7.08757 -9.43361,7.211 2.4055,4.57215 8.45085,7.20862 13.16463,8.78688 z",
    name: "Congo",
  },

  {
    pathDef:
      "m 126.75449,146.80569 c -2.58191,-6.55996 15.47856,-17.22178 4.26138,-17.51728 -4.72869,-4.11005 -6.47027,-14.49361 -14.15544,-7.08614 -5.84943,8.5419 14.1207,10.40195 5.83037,18.25443 -2.01177,1.73438 1.80768,9.67737 4.06369,6.34899 z",
    name: "EastAfrica",
  },

  {
    pathDef:
      "m 135.73996,162.99023 c 1.44229,-3.11754 6.74094,-16.81333 -0.68612,-9.42973 -0.70654,1.89559 -5.26813,12.61489 0.68612,9.42973 z",
    name: "Madagascar",
  },

  {
    pathDef:
      "m 181.48428,163.80263 c 4.69453,-3.28933 10.89581,-2.81959 15.31211,-2.94189 3.76095,-8.00128 -5.36885,-5.45906 -8.61403,-7.90437 1.37638,-5.6302 -1.81667,-11.54938 -6.42319,-5.66119 -6.13871,1.61132 -6.93548,17.48205 -0.27489,16.50745 z",
    name: "WesternAustralia",
  },
  {
    pathDef:
      "m 205.74491,163.32678 c 5.55769,-7.07763 -2.59685,-16.20558 -6.54032,-20.8468 -3.48974,7.73208 -8.04826,-8.25229 -9.94546,2.22198 -2.18852,6.89586 3.82415,9.27494 9.33645,8.56229 -0.40546,4.24709 0.0466,20.29737 6.6382,10.97263 0.17038,-0.30337 0.34075,-0.60673 0.51113,-0.9101 z",
    name: "EasternAustralia",
  },
  {
    pathDef:
      "m 120.48944,167.35165 c 3.32598,-5.35045 7.27672,-14.08848 7.47237,-18.75292 -3.11247,6.21614 -4.89672,2.28927 -5.80165,-2.29265 -1.34718,10.55514 -14.46426,-10.33765 -12.82363,3.25951 0.85691,6.10414 2.14796,18.7997 8.60175,18.93353 l 1.30414,-0.51149 z",
    name: "SouthAfrica",
  },
  {
    pathDef:
      "m 57.111592,169.43478 c -5.680851,-6.80679 1.57145,-14.47547 4.753961,-19.96598 6.246043,-4.02896 -5.015535,-12.29866 -10.986271,-12.01629 0.350445,9.71141 -3.114665,20.92308 1.526625,29.71745 1.089024,0.97254 3.047934,3.79804 4.705685,2.26482 z",
    name: "Argentina",
  },
];
var values = [];
for (item in listOfTerritories) {
  let path = document.querySelector("#" + listOfTerritories[item].name);
  let val = path.getBBox();

  values.push({
    name: listOfTerritories[item].name,
    pathDef: listOfTerritories[item].pathDef,
    textBoxX: val.x,
    textBoxY: val.y,
    textBoxWidth: val.width,
    textBoxHeight: val.height,
  });
}

console.log(values);