## Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY Portfolio.Api.csproj .
RUN dotnet restore Portfolio.Api.csproj

COPY . .
RUN dotnet publish Portfolio.Api.csproj -c Release -o /app/publish --no-restore

## Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "Portfolio.Api.dll"]
