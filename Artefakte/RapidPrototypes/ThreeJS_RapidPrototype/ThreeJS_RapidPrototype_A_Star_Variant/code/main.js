async function main()
{
    const pathMeshPath = "obj/pathMesh.obj";
    // const pathMeshPath = "obj/pathMesh_TEST.obj";
    const pathMesh = await importPathMesh(pathMeshPath);
    console.log(pathMesh)

    let path = await findPath(pathMesh[159], pathMesh[182], pathMesh,true,true)

    console.log(path)
}

main();