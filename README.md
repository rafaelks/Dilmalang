# Dilmalang

A programming language that transforms to JavaScript following the words that president Dilma said

# Authors

 - [Rafael K. Streit](https://twitter.com/rafaelks)
 - [Rodrigo K. Nascimento](https://twitter.com/orodrigok)

# Dictionary of values

This is the dictionary similar to JavaScript:
 - **ministerio**: class
 - **cc**: this
 - **secretaria**: function
 - **dobrarAMeta**: **2
 - **porque**: if
 - **casoContrario**: else
 - **politico**: var
 - **estocarVento**: array // by @otondin
 - **figuraOculta**: delete // by @otondin
 - **midiaGolpista**: console.log // by @otondin
 - **propina**: number
 - **laranja**: string
 - **corrupto**: true
 - **honesto**: false
 - **carater**: boolean
 - **tentar**: try
 - **lavaJato**: exception/catch
 - **pedalada**: error
 - **delatar**: return
 - **euViVoceVeja**: for
 - **euJaVi**: continue
 - **pareiDeVer**: break
 - **meta**: null
 - **jogaPraDentro**: Array().append
 - **.,**: ;

# Formal language definition

```
S -> PROG

PROG = loop | if | EXPRESSION | function | CALL | DECLARATION
DECLARATION = politico ATTRIBUTION
RETURNABLEPROG = return PROG
VALUE = string | number | bool | FUNCTION | CALL | EXPRESSION
CONDITION = == | <= | < | >= | > | !==
ATTRIBUTION = var = VALUE
EXPRESSION = VALUE CONDITION VALUE | !*VALUE | VALUE++ | VALUE-- | VALUE
IF = porque (EXPRESSION) { PROG }
SEPARATOR = .,
LOOP = euViVoceVeja (ATTRIBUTION SEPARATOR EXPRESSION SEPARATOR EXPRESSION) { PROG }
FUNCTION = secretaria id(PARAMS) { RETURNABLEPROG }
PARAMS = (id(,\s*)?)*
VALUES = (VALUE(,\s*)?)*
CALL = id(VALUES)
```

# How to run

## Make sure you're using latest Node version

```shell
$ npm install nave -g
$ nave use latest
```

## Install dependencies

```shell
$ npm install
```

## Run

```shell
$ npm start
```

## Run tests

```shell
$ npm test
```
