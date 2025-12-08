---
title: "Test"
---
{{ $img := resources.Get "images/profil-atelier-tablette.png" }}{{ if $img }}Image found: {{ $img.RelPermalink }}{{ else }}Image NOT found{{ end }}
