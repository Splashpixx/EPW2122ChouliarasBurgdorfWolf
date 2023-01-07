async function main()
{
    const pathMeshPath = "obj/pathMesh.obj";
    // const pathMeshPath = "obj/pathMesh_TEST.obj";
    const pathMesh = await importPathMesh(pathMeshPath);
    console.log(pathMesh)

    let path = await findPath(pathMesh[34], pathMesh[164], pathMesh)

    console.log(path)
}

main();