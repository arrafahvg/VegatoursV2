$token = "cfoat_OdP7-KM5CohcckHusdLo-DGywsTroSB_uuEkINsS1NE.1OK4Kr4KXMuaLW9XAuZz_3xDzPDOjkesBDPlj_iXJ0g"
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}
$url = "https://api.cloudflare.com/client/v4/accounts/9165a339e9b5eb55e7727366085e7f60/pages/projects/vegatours/deployments/e6f556f8-f294-4e47-8726-48e63adbdc3f"
$result = Invoke-RestMethod -Uri $url -Headers $headers -Method Get
$result | ConvertTo-Json -Depth 10