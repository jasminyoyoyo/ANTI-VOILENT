# Datawrapper upload files

Upload one numbered CSV per choropleth. Each file contains one indicator and
eight Australian states/territories.

Recommended Datawrapper field choices:

- Match geographic regions using `state_name`; try `state_code` if the selected
  basemap expects abbreviations.
- Colour/value field: `value_percent`
- Tooltip label: `state_name`
- Tooltip value: `display_value`
- Optional uncertainty field: `rse_percent`

Do not use `rse_percent` as the mapped value. It describes uncertainty in the
survey estimate.

The six indicator files are generated from ABS PSS 2021–22 Table 9.3, with RSE
values paired from Table 9.4. The combined file is supplied for inspection or
other chart types; it is not the recommended upload for a single map.

Regenerate the files from the repository root with:

```powershell
python scripts/prepare_pss_datawrapper_csv.py
```
