#!/bin/sh
for file in layouts.yaml/*.yaml
do
  json="layouts/$(basename ${file%.*}).json"
  kalamine $file --out $json
done
