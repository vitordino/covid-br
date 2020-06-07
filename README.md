# covid — br

[![Netlify Status](https://api.netlify.com/api/v1/badges/08af73cb-e15a-43b4-8c2f-705810c7888a/deploy-status)](https://app.netlify.com/sites/covid-br/deploys)


## Development Guide
```bash
# install project dependencies
$ yarn

# development server
$ yarn start # build data files and starts dev server

# build site for production and hosting
$ yarn build # build data files and outputs the app to ./build directory
```

## Credits

Covid-19 data sourced from [wcota/covid19br](https://github.com/wcota/covid19br) github repo

Geographical and Demographics from [IBGE](https://www.ibge.gov.br/)

Icon is a part of [Font Awesome](https://fontawesome.com/icons/shield-virus?style=solid) 

Typeface is [Inter](https://rsms.me/inter/)

## Tech Stack

| name | license | description |
|:-----|:--------|:------------|
| [`react`](https://reactjs.org/) | [`MIT`](https://api.github.com/repos/facebook/react/license) | declarative, component-based, functional approach to user interfaces |
| [`styled-components`](https://styled-components.com) | [`MIT`](https://github.com/styled-components/styled-components/blob/master/LICENSE) | visual primitives for the component age |
| [`etymos`](https://github.com/vitordino/etymos) | [`MIT`](https://github.com/vitordino/etymos/blob/master/LICENSE) | responsive toolkit for declarative styled-components |
| [`swr`](https://swr.now.sh/) | [`MIT`](https://github.com/vercel/swr/blob/master/LICENSE) | React Hooks library for remote data fetching |
| [`vx`](https://vx-demo.now.sh/) | [`MIT`](https://github.com/hshoff/vx/blob/master/LICENSE) | collection of reusable low-level visualization components |
| [`@fast-csv/parse`](https://c2fo.io/fast-csv/) | [`MIT`](https://github.com/C2FO/fast-csv/blob/master/LICENSE) | CSV parser and formatter for node |
| [`zustand`](https://zustand.surge.sh/) | [`MIT`](https://github.com/react-spring/zustand/blob/master/LICENSE) | Bare necessities for state management in React |
| [`react-table`](https://github.com/tannerlinsley/react-table) | [`MIT`](https://github.com/tannerlinsley/react-table/blob/master/LICENSE) | Hooks for building fast and extendable tables and datagrids for React |


#### System Dependencies
| name   | min. version |
|:-------|-------------:|
| `node` |     `10.0.0` |
| `yarn` |      `1.0.0` |
