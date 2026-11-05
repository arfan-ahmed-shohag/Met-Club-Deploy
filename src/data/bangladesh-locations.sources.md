# Bangladesh registration locations

`bangladesh-locations.json` is a bundled snapshot for the registration form's division → district → thana/upazila dropdowns. It contains 8 divisions, 64 districts, and 662 location options, covering the National Portal's 495 linked upazilas and additional district/metropolitan police stations. No remote location API is called by the form.

Sources inspected on 2026-11-05:

- [Bangladesh GeoCode](https://github.com/nuhil/bangladesh-geocode): division/district identifiers, Bangla names, and the base upazila hierarchy. MIT license reproduced in `bangladesh-geocode.LICENSE`.
- [Bangladesh National Portal upazila directory](https://bangladesh.gov.bd/views/upazila-list): the 495 linked upazilas, including Shayestaganj, which is absent from the base GeoCode snapshot. The portal's headline count and number of linked entries differ; the data uses the linked directory entries.
- District judiciary directories at `https://{district}.judiciary.gov.bd/bn/servicve-box-detail/police-stations`: district police station names, including stations such as Ashulia, Fatullah, Jorarganj and Madhabdi. District spellings follow the directory host names, e.g. `cumilla`, `barishal`, and `netrakona`.
- Metropolitan judiciary directories: [Chattogram](https://metrochattogram.judiciary.gov.bd/bn/servicve-box-detail/police-stations), [Khulna](https://metrokhulna.judiciary.gov.bd/bn/servicve-box-detail/police-stations), [Rajshahi](https://metrorajshahi.judiciary.gov.bd/bn/servicve-box-detail/police-stations), [Sylhet](https://metrosylhet.judiciary.gov.bd/bn/servicve-box-detail/police-stations), [Barishal](https://metrobarishal.judiciary.gov.bd/bn/servicve-box-detail/police-stations), and [Rangpur](https://metrorangpur.judiciary.gov.bd/bn/servicve-box-detail/police-stations).
- [Dhaka Metropolitan Police directory](https://dmp.gov.bd/contact-us/): all 50 DMP station names, including Hatirjheel and separate Uttara East/West stations.
- [Gazipur Metropolitan Police history](https://www.gmp.gov.bd/history.php): the eight metropolitan stations. The page was available through the web index during research; its direct download returned 404.

Unicode and common spelling variants are normalized, obsolete South Sunamganj is displayed as Shantiganj, and station suffixes/officer details are omitted. Upazila and police station boundaries can differ, so the selector is deliberately labelled “থানা / উপজেলা”. Jhalakathi's judiciary directory was unavailable; its four upazila names are retained from GeoCode.

The snapshot should be reviewed against the government directories when administrative boundaries or police jurisdictions change.
