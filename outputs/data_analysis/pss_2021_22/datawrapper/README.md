# Datawrapper upload files

Upload one numbered CSV per choropleth. Each minimal file contains one
indicator and eight Australian states/territories.

Recommended Datawrapper field choices:

- Match geographic regions using `state_name`; try `state_code` if the selected
  basemap expects abbreviations.
- Colour/value field: `value_percent`
- Tooltip label: `state_name`
- Tooltip value: `value_percent` (set a `%` suffix and one decimal place in
  Datawrapper)
- Optional uncertainty field: `rse_percent`

Do not use `rse_percent` as the mapped value. It describes uncertainty in the
survey estimate.

The six indicator files are generated from ABS PSS 2021–22 Table 9.3, with RSE
values paired from Table 9.4.

Add this source in Datawrapper's source field instead of repeating it in every
CSV row:

`Australian Bureau of Statistics, Personal Safety Survey 2021–22, Table 9.3
(RSE: Table 9.4), released 15 March 2023. Women aged 18 years and over;
experiences since age 15.`

Regenerate the files from the repository root with:

```powershell
python scripts/prepare_pss_datawrapper_csv.py
```
