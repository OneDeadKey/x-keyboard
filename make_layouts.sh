#!/bin/sh
for file in layouts.yaml/*
do
  kalamine $file --out layouts/$(basename ${file%.*}).json
done
